import os
import razorpay
import qrcode
import base64
from io import BytesIO
from flask import Flask, jsonify, render_template, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, inspect, text
from sqlalchemy.exc import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gkart.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
razorpay_client = razorpay.Client(auth=(os.getenv('RAZORPAY_KEY_ID', ''), os.getenv('RAZORPAY_KEY_SECRET', '')))


class Account(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(30), nullable=False)
    email = db.Column(db.String(120), nullable=False, index=True)
    city = db.Column(db.String(80), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    vendor_address = db.Column(db.String(255), nullable=True)
    photo = db.Column(db.Text, nullable=True)
    upi_qr = db.Column(db.Text, nullable=True)
    upi_id = db.Column(db.String(120), nullable=True)
    __table_args__ = (db.UniqueConstraint('email', 'role', name='unique_account_email_role'),)


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False, index=True)
    slot = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(160), nullable=False)
    price = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, nullable=False, default=0)
    description = db.Column(db.Text, nullable=False, default='')
    photo = db.Column(db.Text, nullable=False)
    vendor = db.relationship('Account', backref=db.backref('products', lazy=True))
    __table_args__ = (db.UniqueConstraint('vendor_id', 'slot', name='unique_vendor_product_slot'),)


class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product_name = db.Column(db.String(160), nullable=False)
    vendor_name = db.Column(db.String(120), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_method = db.Column(db.String(20), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='paid')
    payment_status = db.Column(db.String(20), nullable=False, default='pending')
    settlement_status = db.Column(db.String(20), nullable=False, default='held')
    platform_fee = db.Column(db.Float, nullable=False, default=0)
    vendor_payout = db.Column(db.Float, nullable=False, default=0)
    payment_reference = db.Column(db.String(120), nullable=True)
    delivery_address = db.Column(db.Text, nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    alternate_phone = db.Column(db.String(30), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False, index=True)
    vendor_id = db.Column(db.Integer, db.ForeignKey('account.id'), nullable=False, index=True)
    customer_name = db.Column(db.String(120), nullable=False)
    product_name = db.Column(db.String(160), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, server_default=db.func.now())
    product = db.relationship('Product')
    __table_args__ = (db.UniqueConstraint('customer_id', 'product_id', name='unique_customer_product_review'),)


with app.app_context():
    db.create_all()
    inspector = inspect(db.engine)
    account_columns = {column['name'] for column in inspector.get_columns('account')}
    product_columns = {column['name'] for column in inspector.get_columns('product')}
    account_indexes = inspector.get_indexes('account')
    account_unique_constraints = inspector.get_unique_constraints('account')
    legacy_email_index = next((index for index in account_indexes if index['name'] == 'ix_account_email' and index['unique']), None)
    has_role_email_constraint = any(
        set(constraint.get('column_names') or []) == {'email', 'role'}
        for constraint in account_unique_constraints
    )
    if legacy_email_index:
        db.session.execute(text('DROP INDEX ix_account_email'))
    if not has_role_email_constraint:
        db.session.execute(text('CREATE UNIQUE INDEX IF NOT EXISTS unique_account_email_role ON account (email, role)'))
    if 'upi_qr' not in account_columns:
        db.session.execute(text('ALTER TABLE account ADD COLUMN upi_qr TEXT'))
    if 'upi_id' not in account_columns:
        db.session.execute(text('ALTER TABLE account ADD COLUMN upi_id VARCHAR(120)'))
    if 'description' not in product_columns:
        db.session.execute(text("ALTER TABLE product ADD COLUMN description TEXT NOT NULL DEFAULT ''"))
    order_columns = {column['name'] for column in inspector.get_columns('order')}
    if 'delivery_address' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN delivery_address TEXT'))
    if 'phone' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN phone VARCHAR(30)'))
    if 'alternate_phone' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN alternate_phone VARCHAR(30)'))
    if 'payment_status' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN payment_status VARCHAR(20) NOT NULL DEFAULT \'pending\''))
    if 'settlement_status' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN settlement_status VARCHAR(20) NOT NULL DEFAULT \'held\''))
    if 'platform_fee' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN platform_fee FLOAT NOT NULL DEFAULT 0'))
    if 'vendor_payout' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN vendor_payout FLOAT NOT NULL DEFAULT 0'))
    if 'payment_reference' not in order_columns:
        db.session.execute(text('ALTER TABLE "order" ADD COLUMN payment_reference VARCHAR(120)'))
    db.session.commit()


def account_response(account):
    return {
        'id': account.id,
        'fullName': account.full_name,
        'phone': account.phone,
        'email': account.email,
        'city': account.city,
        'role': account.role,
        'vendorAddress': account.vendor_address or '',
        'photo': account.photo or '',
        'upiQr': account.upi_qr or '',
        'upiId': account.upi_id or '',
    }


def product_response(product):
    return {
        'id': product.id,
        'vendorId': product.vendor_id,
        'slot': product.slot,
        'storeName': product.vendor.full_name,
        'name': product.name,
        'price': product.price,
        'discount': product.discount,
        'photo': product.photo,
        'description': product.description or '',
        'upiQr': product.vendor.upi_qr or '',
        'upiId': product.vendor.upi_id or '',
    }


def review_response(review):
    return {
        'id': review.id,
        'customerId': review.customer_id,
        'customerName': review.customer_name,
        'productId': review.product_id,
        'productName': review.product_name,
        'productPhoto': review.product.photo if review.product else '',
        'vendorId': review.vendor_id,
        'rating': review.rating,
        'comment': review.comment,
        'createdAt': review.created_at.isoformat() if review.created_at else '',
    }


def order_response(order):
    product = Product.query.get(order.product_id)
    return {
        'id': order.id,
        'customerId': order.customer_id,
        'productName': order.product_name,
        'vendorName': order.vendor_name,
        'vendorId': product.vendor_id if product else None,
        'amount': order.amount,
        'paymentMethod': order.payment_method,
        'status': order.status,
        'paymentStatus': order.payment_status,
        'settlementStatus': order.settlement_status,
        'platformFee': order.platform_fee,
        'vendorPayout': order.vendor_payout,
        'paymentReference': order.payment_reference or '',
        'deliveryAddress': order.delivery_address or '',
        'phone': order.phone or '',
        'alternatePhone': order.alternate_phone or '',
        'createdAt': order.created_at.isoformat() if order.created_at else '',
    }


@app.post('/api/auth/register')
def register():
    data = request.get_json(silent=True) or {}
    required = ('fullName', 'phone', 'email', 'city', 'password', 'role')
    if any(not str(data.get(field, '')).strip() for field in required):
        return jsonify({'error': 'Please complete all required account fields.'}), 400
    if data['role'] not in ('customer', 'vendor'):
        return jsonify({'error': 'Invalid account role.'}), 400
    if len(data['password']) < 8:
        return jsonify({'error': 'Password must be at least 8 characters.'}), 400
    if data['role'] == 'vendor' and not str(data.get('vendorAddress', '')).strip():
        return jsonify({'error': 'Vendor address is required.'}), 400
    if data['role'] == 'vendor' and not str(data.get('upiQr', '')).strip():
        return jsonify({'error': 'A valid UPI QR image is required for vendor accounts.'}), 400

    email = data['email'].strip().lower()
    if Account.query.filter_by(email=email, role=data['role']).first():
        return jsonify({'error': f'An account with this Gmail address already exists for the {data["role"]} section.'}), 409

    account = Account(
        full_name=data['fullName'].strip(),
        phone=data['phone'].strip(),
        email=email,
        city=data['city'].strip(),
        password_hash=generate_password_hash(data['password']),
        role=data['role'],
        vendor_address=str(data.get('vendorAddress', '')).strip() or None,
        photo=data.get('photo', ''),
        upi_qr=data.get('upiQr', '') if data['role'] == 'vendor' else '',
    )
    db.session.add(account)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({'error': f'An account with this Gmail address already exists for the {data["role"]} section.'}), 409
    return jsonify({'account': account_response(account)}), 201


@app.post('/api/auth/login')
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    role = data.get('role')
    account_query = Account.query.filter_by(email=email)
    if role in ('customer', 'vendor'):
        account_query = account_query.filter_by(role=role)
    account = account_query.first()
    if not account or not check_password_hash(account.password_hash, password):
        return jsonify({'error': 'The Gmail address or password is incorrect.'}), 401
    if role not in ('customer', 'vendor'):
        return jsonify({'error': 'Please choose whether you are signing in as a customer or vendor.'}), 400
    return jsonify({'account': account_response(account)})


@app.put('/api/vendor/profile')
def update_vendor_profile():
    data = request.get_json(silent=True) or {}
    account_id = data.get('id')
    if not account_id:
        return jsonify({'error': 'Account ID is required.'}), 400

    account = Account.query.get(account_id)
    if not account:
        return jsonify({'error': 'Account not found.'}), 404
    if account.role != 'vendor':
        return jsonify({'error': 'Unauthorized. Account is not a vendor.'}), 403

    if 'fullName' in data:
        account.full_name = data['fullName'].strip()
    if 'phone' in data:
        account.phone = data['phone'].strip()
    if 'city' in data:
        account.city = data['city'].strip()
    if 'vendorAddress' in data:
        account.vendor_address = data['vendorAddress'].strip()
    if 'photo' in data:
        account.photo = data['photo']
    if 'upiQr' in data:
        account.upi_qr = data['upiQr']
    if 'upiId' in data:
        account.upi_id = str(data['upiId']).strip() or None
    db.session.commit()
    return jsonify({'account': account_response(account)}), 200


@app.get('/api/shops/search')
def search_shops():
    query_param = request.args.get('q', '').strip()
    city_param = request.args.get('city', '').strip()
    query = Account.query.filter_by(role='vendor')

    if query_param:
        search_pattern = f'%{query_param}%'
        query = query.outerjoin(Product, Product.vendor_id == Account.id).filter(
            Account.full_name.ilike(search_pattern) |
            Account.vendor_address.ilike(search_pattern) |
            Product.name.ilike(search_pattern) |
            Product.description.ilike(search_pattern)
        ).distinct()
    if city_param:
        query = query.filter(Account.city.ilike(city_param))

    vendors = query.all()
    shops = []
    for vendor in vendors:
        shop = account_response(vendor)
        if query_param:
            search_pattern = f'%{query_param}%'
            shop['matchingProducts'] = [
                product_response(product)
                for product in vendor.products
                if query_param.casefold() in product.name.casefold()
                or query_param.casefold() in (product.description or '').casefold()
            ]
        shops.append(shop)
    return jsonify({'shops': shops}), 200


@app.post('/api/vendor/products')
def save_vendor_product():
    data = request.get_json(silent=True) or {}
    account = Account.query.get(data.get('accountId'))
    if not account:
        return jsonify({'error': 'Account not found.'}), 404
    if account.role != 'vendor':
        return jsonify({'error': 'Unauthorized. Account is not a vendor.'}), 403
    required = ('slot', 'name', 'price', 'photo')
    if any(data.get(field) in (None, '') for field in required):
        return jsonify({'error': 'Product name, price, photo, and slot are required.'}), 400

    try:
        slot = int(data['slot'])
        price = float(data['price'])
        discount = float(data.get('discount') or 0)
    except (TypeError, ValueError):
        return jsonify({'error': 'Product slot, price, and discount must be numbers.'}), 400
    if price < 0 or discount < 0 or discount > 100:
        return jsonify({'error': 'Price and discount values are invalid.'}), 400
    description = str(data.get('description', '')).strip()
    if len(description.split()) > 200:
        return jsonify({'error': 'Product description must be 200 words or fewer.'}), 400

    product = Product.query.filter_by(vendor_id=account.id, slot=slot).first()
    if not product:
        product = Product(vendor_id=account.id, slot=slot)
        db.session.add(product)
    product.name = str(data['name']).strip()
    product.price = price
    product.discount = discount
    product.photo = data['photo']
    product.description = description
    db.session.commit()
    return jsonify({'product': product_response(product)}), 201


@app.delete('/api/vendor/products/<int:slot>')
def delete_vendor_product(slot):
    account = Account.query.get(request.args.get('accountId'))
    if not account:
        return jsonify({'error': 'Account not found.'}), 404
    if account.role != 'vendor':
        return jsonify({'error': 'Unauthorized. Account is not a vendor.'}), 403
    product = Product.query.filter_by(vendor_id=account.id, slot=slot).first()
    if product:
        db.session.delete(product)
        db.session.commit()
    return jsonify({'message': 'Product removed.'}), 200


@app.get('/api/vendor/products')
def get_my_vendor_products():
    account = Account.query.get(request.args.get('accountId'))
    if not account:
        return jsonify({'error': 'Account not found.'}), 404
    if account.role != 'vendor':
        return jsonify({'error': 'Unauthorized. Account is not a vendor.'}), 403
    products = Product.query.filter_by(vendor_id=account.id).order_by(Product.slot).all()
    return jsonify({'products': [product_response(product) for product in products]}), 200


@app.get('/api/shops/<int:vendor_id>/products')
def get_vendor_products(vendor_id):
    vendor = Account.query.filter_by(id=vendor_id, role='vendor').first()
    if not vendor:
        return jsonify({'error': 'Vendor shop not found.'}), 404
    products = Product.query.filter_by(vendor_id=vendor.id).order_by(Product.id).all()
    return jsonify({'shop': account_response(vendor), 'products': [product_response(product) for product in products]}), 200


@app.post('/api/payments/razorpay/order')
def create_razorpay_order():
    if not os.getenv('RAZORPAY_KEY_ID') or not os.getenv('RAZORPAY_KEY_SECRET'):
        return jsonify({'error': 'Razorpay is not configured yet. Use the vendor QR code or add Razorpay test keys.'}), 503
    data = request.get_json(silent=True) or {}
    try:
        amount = round(float(data.get('amount', 0)) * 100)
    except (TypeError, ValueError):
        return jsonify({'error': 'Payment amount is invalid.'}), 400
    if amount <= 0:
        return jsonify({'error': 'Payment amount must be greater than zero.'}), 400
    order = razorpay_client.order.create({'amount': amount, 'currency': 'INR', 'receipt': f"gkart_{data.get('productId', 'order')}", 'notes': {'platform': 'gKart', 'customer_id': str(data.get('customerId', ''))}})
    return jsonify({'order': order, 'keyId': os.getenv('RAZORPAY_KEY_ID')}), 201


@app.post('/api/payments/razorpay/verify')
def verify_razorpay_payment():
    if not os.getenv('RAZORPAY_KEY_SECRET'):
        return jsonify({'error': 'Razorpay is not configured yet.'}), 503
    data = request.get_json(silent=True) or {}
    try:
        razorpay_client.utility.verify_payment_signature({
            'razorpay_order_id': data['razorpay_order_id'],
            'razorpay_payment_id': data['razorpay_payment_id'],
            'razorpay_signature': data['razorpay_signature'],
        })
    except (KeyError, razorpay.errors.SignatureVerificationError):
        return jsonify({'error': 'Payment verification failed.'}), 400
    data = request.get_json(silent=True) or {}
    order_data = data.get('order') or {}
    product_ids = order_data.get('productIds') or [order_data.get('productId')]
    if order_data.get('customerId') and any(product_ids):
        saved_orders = [create_order_record(order_data['customerId'], product_id, 'razorpay', 'paid', order_data.get('deliveryAddress', ''), order_data.get('phone', ''), order_data.get('alternatePhone', ''), payment_status='paid', payment_reference=data.get('razorpay_payment_id')) for product_id in product_ids]
        saved_orders = [order for order in saved_orders if order]
        if saved_orders:
            return jsonify({'message': 'Payment verified successfully.', 'orders': [order_response(order) for order in saved_orders]}), 200
    return jsonify({'message': 'Payment verified successfully.'}), 200


def create_order_record(customer_id, product_id, payment_method, status, delivery_address='', phone='', alternate_phone='', payment_status=None, payment_reference=''):
    customer = Account.query.filter_by(id=customer_id, role='customer').first()
    product = Product.query.get(product_id)
    if not customer or not product:
        return None
    amount = round(product.price * (1 - product.discount / 100), 2)
    fee = round(amount * 0.10, 2)
    resolved_payment_status = payment_status or ('pending' if payment_method in ('cash on delivery', 'upi qr') else 'paid')
    order = Order(customer_id=customer.id, product_id=product.id, product_name=product.name, vendor_name=product.vendor.full_name, amount=amount, payment_method=payment_method, status=status, payment_status=resolved_payment_status, settlement_status='held', platform_fee=fee, vendor_payout=round(amount - fee, 2), payment_reference=payment_reference or None, delivery_address=delivery_address, phone=phone, alternate_phone=alternate_phone)
    db.session.add(order)
    db.session.commit()
    return order


@app.post('/api/orders')
def create_order():
    data = request.get_json(silent=True) or {}
    payment_method = data.get('paymentMethod', 'upi')
    if payment_method not in ('cash on delivery', 'upi qr'):
        return jsonify({'error': 'Use the secure Razorpay checkout for online payments.'}), 400
    order = create_order_record(data.get('customerId'), data.get('productId'), payment_method, data.get('status', 'pending'), data.get('deliveryAddress', ''), data.get('phone', ''), data.get('alternatePhone', ''))
    if not order:
        return jsonify({'error': 'A signed-in customer and valid product are required.'}), 400
    return jsonify({'order': order_response(order)}), 201


@app.get('/api/orders')
def get_customer_orders():
    customer = Account.query.filter_by(id=request.args.get('customerId'), role='customer').first()
    if not customer:
        return jsonify({'error': 'Customer account not found.'}), 404
    orders = Order.query.filter_by(customer_id=customer.id).order_by(Order.created_at.desc(), Order.id.desc()).all()
    return jsonify({'orders': [order_response(order) for order in orders]}), 200


@app.get('/api/vendor/orders')
def get_vendor_orders():
    vendor = Account.query.filter_by(id=request.args.get('accountId'), role='vendor').first()
    if not vendor:
        return jsonify({'error': 'Vendor account not found.'}), 404
    product_ids = [product.id for product in Product.query.filter_by(vendor_id=vendor.id).all()]
    orders = Order.query.filter(Order.product_id.in_(product_ids)).order_by(Order.created_at.desc(), Order.id.desc()).all() if product_ids else []
    return jsonify({'orders': [order_response(order) for order in orders]}), 200


@app.patch('/api/vendor/orders/<int:order_id>')
def update_vendor_order(order_id):
    vendor = Account.query.filter_by(id=request.args.get('accountId'), role='vendor').first()
    data = request.get_json(silent=True) or {}
    status = data.get('status')
    order = Order.query.get(order_id)
    product = Product.query.get(order.product_id) if order else None
    if not vendor or not order or not product or product.vendor_id != vendor.id:
        return jsonify({'error': 'Order not found or unauthorized.'}), 404
    if status not in ('paid', 'delivered', 'cancelled'):
        return jsonify({'error': 'Order status must be paid, delivered, or cancelled.'}), 400
    order.status = status
    if status == 'delivered':
        order.payment_status = 'paid'
        order.settlement_status = 'released'
    elif status == 'cancelled':
        order.settlement_status = 'cancelled'
    db.session.commit()
    return jsonify({'order': order_response(order)}), 200


@app.post('/api/reviews')
def save_review():
    data = request.get_json(silent=True) or {}
    customer = Account.query.filter_by(id=data.get('customerId'), role='customer').first()
    product = Product.query.get(data.get('productId'))
    try:
        rating = int(data.get('rating'))
    except (TypeError, ValueError):
        rating = 0
    comment = str(data.get('comment', '')).strip()
    if not customer or not product:
        return jsonify({'error': 'A signed-in customer and valid product are required.'}), 400
    if rating < 1 or rating > 5:
        return jsonify({'error': 'Please choose a rating from 1 to 5 stars.'}), 400
    if not comment:
        return jsonify({'error': 'Please write a comment.'}), 400
    purchased = Order.query.filter_by(customer_id=customer.id, product_id=product.id).first()
    if not purchased:
        return jsonify({'error': 'You can review a product after ordering it.'}), 403
    review = Review.query.filter_by(customer_id=customer.id, product_id=product.id).first()
    if not review:
        review = Review(customer_id=customer.id, product_id=product.id, vendor_id=product.vendor_id, customer_name=customer.full_name, product_name=product.name)
        db.session.add(review)
    review.rating = rating
    review.comment = comment
    review.customer_name = customer.full_name
    review.product_name = product.name
    db.session.commit()
    return jsonify({'review': review_response(review)}), 201


@app.delete('/api/reviews/<int:review_id>')
def delete_review(review_id):
    customer_id = request.args.get('customerId')
    review = Review.query.filter_by(id=review_id, customer_id=customer_id).first()
    if not review:
        return jsonify({'error': 'Review not found or you are not allowed to delete it.'}), 404
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted.'}), 200


@app.get('/api/products/<int:product_id>/reviews')
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc(), Review.id.desc()).all()
    return jsonify({'reviews': [review_response(review) for review in reviews]}), 200


@app.get('/api/vendor/reviews')
def get_vendor_reviews():
    vendor = Account.query.filter_by(id=request.args.get('accountId'), role='vendor').first()
    if not vendor:
        return jsonify({'error': 'Vendor account not found.'}), 404
    reviews = Review.query.filter_by(vendor_id=vendor.id).order_by(Review.created_at.desc(), Review.id.desc()).all()
    return jsonify({'reviews': [review_response(review) for review in reviews]}), 200


@app.get('/api/recommendations')
def get_customer_recommendations():
    customer_id = request.args.get('customerId')
    customer = Account.query.filter_by(id=customer_id, role='customer').first()
    if not customer:
        return jsonify({'products': []}), 200

    orders = Order.query.filter_by(customer_id=customer.id).all()
    purchased_names = {order.product_name.strip().casefold() for order in orders if order.product_name}
    purchased_product_ids = {order.product_id for order in orders if order.product_id}
    purchased_vendor_ids = {
        product.vendor_id
        for product in Product.query.filter(Product.id.in_(purchased_product_ids)).all()
    } if purchased_product_ids else set()
    if not purchased_names:
        return jsonify({'products': []}), 200

    products = Product.query.join(Account).filter(Account.role == 'vendor').all()
    recommendations = [
        product_response(product)
        for product in products
        if product.id not in purchased_product_ids
        and product.vendor_id not in purchased_vendor_ids
        and product.name.strip().casefold() in purchased_names
    ]
    return jsonify({'products': recommendations}), 200


@app.post('/api/payments/upi/qr')
def create_upi_qr():
    data = request.get_json(silent=True) or {}
    upi_id = str(data.get('upiId', '')).strip()
    name = str(data.get('name', 'gKart vendor')).strip()[:80]
    try:
        amount = float(data.get('amount', 0))
    except (TypeError, ValueError):
        return jsonify({'error': 'Payment amount is invalid.'}), 400
    if not upi_id or '@' not in upi_id or amount <= 0:
        return jsonify({'error': 'A valid vendor UPI ID and payment amount are required.'}), 400
    upi_uri = f'upi://pay?pa={upi_id}&pn={name}&am={amount:.2f}&cu=INR'
    image = qrcode.make(upi_uri)
    buffer = BytesIO()
    image.save(buffer, format='PNG')
    qr_data = base64.b64encode(buffer.getvalue()).decode('ascii')
    return jsonify({'qr': f'data:image/png;base64,{qr_data}', 'upiUri': upi_uri}), 200


@app.get('/api/shops/offers')
def get_shop_offers():
    products = Product.query.join(Account).filter(Product.discount > 0, Account.role == 'vendor').order_by(Product.id).all()
    return jsonify({'offers': [product_response(product) for product in products]}), 200


@app.route("/")
def home():
    return render_template('index.html')
@app.route('/template-assets/<path:filename>')
def template_asset(filename):
    return send_from_directory(app.template_folder, filename)
@app.route('/style.css')
def stylesheet():
    return send_from_directory(app.template_folder, 'style.css')
@app.route('/script.js')
def javascript():
    return send_from_directory(app.template_folder, 'script.js')
@app.route("/about")
def about():
    return "This is about page"
if __name__=="__main__":
    app.run(debug=True)