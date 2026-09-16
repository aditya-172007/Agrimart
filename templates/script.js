const accountModal = document.getElementById('accountModal');
const videoIntro = document.getElementById('videoIntro');
const videoIntroNext = document.getElementById('videoIntroNext');
const formRole = document.getElementById('formRole');
const formTitle = document.getElementById('formTitle');
const vendorAddressField = document.getElementById('vendorAddressField');
const vendorAddress = document.getElementById('vendorAddress');
const formMessage = document.getElementById('formMessage');
const guestEntry = document.getElementById('guestEntry');
const accountSwitch = document.getElementById('accountSwitch');
const accountForm = document.getElementById('accountForm');
const passwordLabel = document.getElementById('passwordLabel');
const photoInput = document.getElementById('photo');
const upiQrInput = document.getElementById('upiQr');
const upiQrName = document.getElementById('upiQrName');
const photoName = document.getElementById('photoName');
const guestView = document.getElementById('guestView');
const customerHome = document.getElementById('customerHome');
const customerOffersPage = document.getElementById('customerOffersPage');
const customerStoresPage = document.getElementById('customerStoresPage');
const customerNearbyPage = document.getElementById('customerNearbyPage');
const nearbyShopsList = document.getElementById('nearbyShopsList');
const nearbyLocationNote = document.getElementById('nearbyLocationNote');
const customerPreferencePage = document.getElementById('customerPreferencePage');
const customerPreferencePageList = document.getElementById('customerPreferencePageList');
const customerCartPage = document.getElementById('customerCart');
const customerOrderHistoryList = document.getElementById('customerOrderHistoryList');
const customerPreferenceList = document.getElementById('customerPreferenceList');
const customerReportPage = document.getElementById('customerReport');
const customerOffersList = document.getElementById('customerOffersList');
const customerStoreSearch = document.getElementById('customerStoreSearch');
const shopResults = document.getElementById('shopResults');
const customerLogout = document.getElementById('customerLogout');
const customerAccountToggle = document.getElementById('customerAccountToggle');
const customerAccountOptions = document.getElementById('customerAccountOptions');
const vendorLogout = document.getElementById('vendorLogout');
const vendorAccountToggle = document.getElementById('vendorAccountToggle');
const vendorAccountOptions = document.getElementById('vendorAccountOptions');
const availableShops = document.getElementById('availableShops');
const allStoresList = document.getElementById('allStoresList');
const landingHeader = document.querySelector('body > header');
const pageTransition = document.getElementById('pageTransition');
const boardTitle = document.getElementById('boardTitle');
const itemGrid = document.getElementById('itemGrid');
const itemModal = document.getElementById('itemModal');
const itemForm = document.getElementById('itemForm');
const itemPhoto = document.getElementById('itemPhoto');
const itemDescription = document.getElementById('itemDescription');
const itemPhotoName = document.getElementById('itemPhotoName');
const photoFrame = document.getElementById('photoFrame');
const itemFormMessage = document.getElementById('itemFormMessage');
const filledCount = document.getElementById('filledCount');
const itemSlotNumber = document.getElementById('itemSlotNumber');
const shopProductsModal = document.getElementById('shopProductsModal');
const shopProductsTitle = document.getElementById('shopProductsTitle');
const shopProductsAddress = document.getElementById('shopProductsAddress');
const shopProductsList = document.getElementById('shopProductsList');
const productDetailModal = document.getElementById('productDetailModal');
const productDetailTitle = document.getElementById('productDetailTitle');
const productDetailStore = document.getElementById('productDetailStore');
const productDetailImage = document.getElementById('productDetailImage');
const productDetailPrice = document.getElementById('productDetailPrice');
const productDetailDiscount = document.getElementById('productDetailDiscount');
const productDetailDescription = document.getElementById('productDetailDescription');
const productReviewsList = document.getElementById('productReviewsList');
const productReviewSummary = document.getElementById('productReviewSummary');
const productDetailQr = document.getElementById('productDetailQr');
const productDetailQrImage = document.getElementById('productDetailQrImage');
const qrViewer = document.getElementById('qrViewer');
const qrViewerImage = document.getElementById('qrViewerImage');
const payWithRazorpay = document.getElementById('payWithRazorpay');
const paymentMessage = document.getElementById('paymentMessage');
const markQrPaid = document.getElementById('markQrPaid');
const productCod = document.getElementById('productCod');
const customerCartList = document.getElementById('customerCartList');
const cartTotal = document.getElementById('cartTotal');
const cartNotice = document.getElementById('cartNotice');
const openCheckout = document.getElementById('openCheckout');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutRazorpay = document.getElementById('checkoutRazorpay');
const checkoutCod = document.getElementById('checkoutCod');
const checkoutQrPaid = document.getElementById('checkoutQrPaid');
const checkoutPaymentOptions = document.getElementById('checkoutPaymentOptions');
const deliveryModal = document.getElementById('deliveryModal');
const checkoutDeliveryForm = document.getElementById('checkoutDeliveryForm');
const checkoutMethodLabel = document.getElementById('checkoutMethodLabel');
const checkoutAddress = document.getElementById('checkoutAddress');
const checkoutPhone = document.getElementById('checkoutPhone');
const checkoutAlternatePhone = document.getElementById('checkoutAlternatePhone');
const confirmPaymentDialog = document.getElementById('confirmPaymentDialog');
const confirmPaymentYes = document.getElementById('confirmPaymentYes');
const confirmPaymentNo = document.getElementById('confirmPaymentNo');
const closeConfirmPayment = document.getElementById('closeConfirmPayment');
const checkoutMessage = document.getElementById('checkoutMessage');
const paymentSuccess = document.getElementById('paymentSuccess');
const closePaymentSuccess = document.getElementById('closePaymentSuccess');
const viewOrderHistory = document.getElementById('viewOrderHistory');
const reviewPrompt = document.getElementById('reviewPrompt');
const reviewStarsInput = document.getElementById('reviewStarsInput');
const reviewComment = document.getElementById('reviewComment');
const reviewMessage = document.getElementById('reviewMessage');
const submitReview = document.getElementById('submitReview');
let selectedProductForPayment = null;
let reviewProductForPrompt = null;
let selectedReviewRating = 0;
let checkoutItems = [];
let checkoutMethod = '';
let checkoutFromCart = false;
let cartItems = JSON.parse(localStorage.getItem('gkart-cart') || '[]');

const renderOrderHistory = orders => {
	if (!customerOrderHistoryList) return;
	customerOrderHistoryList.innerHTML = orders.length ? orders.map(order => `<article><strong>${escapeHtml(order.productName)}</strong><span class="order-status ${escapeHtml(order.status)}">${escapeHtml(order.status)}</span><span>Rs ${Number(order.amount).toFixed(2)} · ${escapeHtml(order.paymentMethod)}</span></article>`).join('') : '<p class="shop-results-status">You haven\'t ordered anything yet... Do check the products.</p>';
};

const renderPreferenceProducts = products => {
	if (!customerPreferenceList && !customerPreferencePageList) return;
	const message = '<p class="shop-results-status">Try buying on our store to get recommendations.</p>';
	if (!products.length) {
		if (customerPreferenceList) customerPreferenceList.innerHTML = message;
		if (customerPreferencePageList) customerPreferencePageList.innerHTML = message;
		return;
	}
	const cards = products.map(product => `
		<button class="customer-preference-product" type="button" data-product='${escapeHtml(JSON.stringify(product))}'>
			<img src="${escapeHtml(product.photo)}" alt="${escapeHtml(product.name)}">
			<span><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.storeName)}</small></span>
			<b>Rs ${Number(product.price).toFixed(2)} <span aria-hidden="true">↗</span></b>
		</button>
	`).join('');
	[customerPreferenceList, customerPreferencePageList].filter(Boolean).forEach(list => {
		list.innerHTML = cards;
		list.querySelectorAll('[data-product]').forEach(button => {
			button.addEventListener('click', () => openProductDetails(JSON.parse(button.dataset.product)));
		});
	});
};

const loadPreferenceProducts = async customerId => {
	if (!customerPreferenceList && !customerPreferencePageList) return;
	if (!customerId || profileData.role !== 'customer') {
		renderPreferenceProducts([]);
		return;
	}
	try {
		const response = await fetch(`/api/recommendations?customerId=${encodeURIComponent(customerId)}`);
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to load recommendations.');
		renderPreferenceProducts(result.products || []);
	} catch (error) {
		const message = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
		if (customerPreferenceList) customerPreferenceList.innerHTML = message;
		if (customerPreferencePageList) customerPreferencePageList.innerHTML = message;
	}
};

const loadOrderHistory = async customerId => {
	if (!customerId) return;
	try {
		const response = await fetch(`/api/orders?customerId=${encodeURIComponent(customerId)}`);
		const result = await readJsonResponse(response);
		if (response.ok) {
			renderOrderHistory(result.orders || []);
			loadPreferenceProducts(customerId);
		}
	} catch (error) {
		console.error(error);
	}
};

const recordQrOrder = async () => {
	if (!selectedProductForPayment) return;
	const customerId = localStorage.getItem('userId');
	if (profileData.role !== 'customer' || !customerId) {
		paymentMessage.textContent = 'Please sign in as a customer before recording a purchase.';
		return;
	}
	const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, productId: selectedProductForPayment.id, paymentMethod: 'upi qr', status: 'pending' }) });
	const result = await readJsonResponse(response);
	if (!response.ok) throw new Error(result.error || 'Unable to record the QR payment.');
	paymentMessage.textContent = 'Purchase added to your order history.';
	loadOrderHistory(customerId);
	showPaymentSuccess();
};

const showPaymentSuccess = (title = 'Payment successful.', message = 'Your order has been added to your order history.', reviewProduct = selectedProductForPayment) => {
	productDetailModal.classList.remove('open');
	checkoutModal.classList.remove('open');
	document.getElementById('paymentSuccessTitle').textContent = title;
	document.querySelector('#paymentSuccess p').textContent = message;
	reviewProductForPrompt = reviewProduct;
	selectedReviewRating = 0;
	reviewComment.value = '';
	reviewMessage.textContent = '';
	reviewPrompt.hidden = !reviewProductForPrompt;
	submitReview.textContent = 'Post review';
	submitReview.disabled = false;
	reviewStarsInput?.querySelectorAll('button').forEach(button => button.classList.remove('selected'));
	paymentSuccess.classList.add('open');
};

const dismissPaymentSuccess = () => { paymentSuccess.classList.remove('open'); showCustomerPage('customerHome'); };
closePaymentSuccess?.addEventListener('click', dismissPaymentSuccess);
viewOrderHistory?.addEventListener('click', () => { paymentSuccess.classList.remove('open'); showCustomerPage('customerCart'); });
reviewStarsInput?.addEventListener('click', event => {
	const button = event.target.closest('[data-rating]');
	if (!button) return;
	selectedReviewRating = Number(button.dataset.rating);
	reviewStarsInput.querySelectorAll('button').forEach(star => star.classList.toggle('selected', Number(star.dataset.rating) <= selectedReviewRating));
});
submitReview?.addEventListener('click', async () => {
	const customerId = localStorage.getItem('userId');
	if (!reviewProductForPrompt || !customerId) return;
	if (!selectedReviewRating || !reviewComment.value.trim()) {
		reviewMessage.textContent = 'Choose stars and write a comment first.';
		reviewMessage.classList.add('show');
		return;
	}
	submitReview.disabled = true;
	reviewMessage.textContent = '';
	try {
		const response = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, productId: reviewProductForPrompt.id, rating: selectedReviewRating, comment: reviewComment.value.trim() }) });
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to post your review.');
		reviewMessage.textContent = 'Review posted. Thank you.';
		reviewMessage.classList.add('show');
		submitReview.textContent = 'Review posted';
		setTimeout(dismissPaymentSuccess, 500);
	} catch (error) {
		reviewMessage.textContent = error.message;
		reviewMessage.classList.add('show');
	} finally { submitReview.disabled = false; }
});
const productBoard = document.querySelector('.product-board');
const salesDashboard = document.getElementById('salesDashboard');
const profileView = document.getElementById('profile');
const profileEditModal = document.getElementById('profileEditModal');
const profileEditForm = document.getElementById('profileEditForm');
const editPhoto = document.getElementById('editPhoto');
const editPhotoName = document.getElementById('editPhotoName');
const editUpiQr = document.getElementById('editUpiQr');
const editUpiQrName = document.getElementById('editUpiQrName');
let editUpiId = document.getElementById('editUpiId');
const profileEditMessage = document.getElementById('profileEditMessage');
const profileAvatar = document.getElementById('profileAvatar');
const profileTitle = document.getElementById('profileTitle');
const profileName = document.getElementById('profileName');
const profileLocation = document.getElementById('profileLocation');
const profilePhone = document.getElementById('profilePhone');
const profileEmail = document.getElementById('profileEmail');
const profileCity = document.getElementById('profileCity');
const profileQr = document.getElementById('profileQr');
const profileQrEmpty = document.getElementById('profileQrEmpty');
const profileQrAction = document.getElementById('profileQrAction');
const homeLink = document.querySelector('.static-nav-links a[href="#guestView"]');
const dashboardLink = document.querySelector('.static-nav-links a[href="#salesDashboard"]');
const profileLink = document.querySelector('.static-nav-links a[href="#profile"]');
const reviewsView = document.getElementById('reviews');
const vendorOrdersView = document.getElementById('vendorOrders');
const vendorOrdersList = document.getElementById('vendorOrdersList');
const vendorOrderBadge = document.getElementById('vendorOrderBadge');
const dashboardSales = document.getElementById('dashboardSales');
const dashboardRevenue = document.getElementById('dashboardRevenue');
const dashboardProducts = document.getElementById('dashboardProducts');
const dashboardPending = document.getElementById('dashboardPending');
const reportView = document.getElementById('report');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotChoices = document.getElementById('chatbotChoices');
const chatbotShell = document.querySelector('.chatbot-shell');
const commentForm = document.getElementById('commentForm');
const reportComment = document.getElementById('reportComment');
const bugForm = document.getElementById('bugForm');
const bugScreenshot = document.getElementById('bugScreenshot');
const bugScreenshotName = document.getElementById('bugScreenshotName');
const customerForm = document.getElementById('customerForm');
const questionButtons = [...chatbotChoices.querySelectorAll('button')];
const customerChatbotMessages = document.getElementById('customerChatbotMessages');
const customerChatbotChoices = document.getElementById('customerChatbotChoices');
const customerChatbotShell = document.querySelector('#customerReport .chatbot-shell');
const customerCommentForm = document.getElementById('customerCommentForm');
const customerReportComment = document.getElementById('customerReportComment');
const customerBugForm = document.getElementById('customerBugForm');
const customerBugScreenshot = document.getElementById('customerBugScreenshot');
const customerBugScreenshotName = document.getElementById('customerBugScreenshotName');
const customerCustomerForm = document.getElementById('customerCustomerForm');
const customerQuestionButtons = customerChatbotChoices ? [...customerChatbotChoices.querySelectorAll('button')] : [];
const usedQuestions = new Set();
const reviewList = document.getElementById('reviewList');
const reviewEmpty = document.getElementById('reviewEmpty');
let customerReviews = JSON.parse(localStorage.getItem('gkart-reviews') || '[]');
let profileData = JSON.parse(localStorage.getItem('gkart-profile') || 'null') || { id: '', name: 'Your name', phone: '', email: '', city: '', vendorAddress: '', image: '', password: '', role: '', upiId: '' };
let selectedSlot = 0;
let itemImage = '';
let selectedRole = 'customer';

window.scrollTo(0, 0);

const readJsonResponse = async response => {
	const responseText = await response.text();
	if (!responseText) throw new Error(`Server returned an empty response (HTTP ${response.status}).`);
	try {
		return JSON.parse(responseText);
	} catch {
		throw new Error(`Server returned an invalid response (HTTP ${response.status}).`);
	}
};

const dismissVideoIntro = () => {
	videoIntro.classList.add('is-dismissed');
	videoIntro.querySelector('video').pause();
	videoIntroNext.blur();
};

videoIntroNext.addEventListener('click', dismissVideoIntro);

const prepareBoardHeadline = () => {
	let letterIndex = 0;
	const textNodes = [...boardTitle.childNodes].filter(node => node.nodeType === Node.TEXT_NODE);
	textNodes.forEach(node => {
		const fragment = document.createDocumentFragment();
		[...node.textContent].forEach(character => {
			const letter = document.createElement('span');
			letter.className = 'board-letter';
			letter.style.setProperty('--letter-index', letterIndex++);
			letter.textContent = character === ' ' ? '\u00a0' : character;
			fragment.appendChild(letter);
		});
		node.replaceWith(fragment);
	});
};

const replayBoardHeadline = () => {
	boardTitle.classList.remove('animate');
	void boardTitle.offsetWidth;
	boardTitle.classList.add('animate');
};

prepareBoardHeadline();
setInterval(replayBoardHeadline, 3000);

const savedItems = JSON.parse(localStorage.getItem('gkart-items') || '[]');
const storedExtraSlots = Number(localStorage.getItem('gkart-extra-slots') || 0);
let extraSlots = Number.isFinite(storedExtraSlots) ? Math.max(0, Math.floor(storedExtraSlots)) : 0;
localStorage.setItem('gkart-extra-slots', String(extraSlots));

const loadVendorProducts = async accountId => {
	try {
		const response = await fetch(`/api/vendor/products?accountId=${encodeURIComponent(accountId)}`);
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to load your products.');
		result.products.forEach(product => {
			savedItems[product.slot] = {
				name: product.name,
				price: product.price,
				discount: product.discount,
				description: product.description,
				image: product.photo,
			};
		});
		localStorage.setItem('gkart-items', JSON.stringify(savedItems));
		renderItems();
	} catch (error) {
		console.error(error);
	}
};

const renderProfile = () => {
	profileTitle.textContent = profileData.name || 'Your local identity';
	profileName.textContent = profileData.name || 'Your name';
	profileLocation.textContent = profileData.city ? `Based in ${profileData.city}` : 'Find your local people.';
	profilePhone.textContent = profileData.phone || 'Not added';
	profileEmail.textContent = profileData.email ? `${profileData.email.slice(0, 2)}••••••@gmail.com` : 'Private email';
	profileCity.textContent = profileData.city || 'Not added';
	profileAvatar.textContent = profileData.image ? '' : (profileData.name || 'g.').slice(0, 1).toUpperCase();
	profileAvatar.style.backgroundImage = profileData.image ? `url("${profileData.image}")` : '';
	profileAvatar.classList.toggle('has-image', Boolean(profileData.image));
	profileQr.src = profileData.upiQr || '';
	profileQr.hidden = !profileData.upiQr;
	profileQrEmpty.hidden = Boolean(profileData.upiQr);
	profileQrAction.hidden = profileData.role !== 'vendor';
	profileQrAction.textContent = profileData.upiQr ? 'Update QR code' : 'Add QR code';
};

renderProfile();


const renderReviews = () => {
	reviewEmpty.style.display = customerReviews.length ? 'none' : 'grid';
	reviewList.innerHTML = customerReviews.map((review, index) => `<article class="review-card"><img src="${review.image}" alt="${review.product}"><button class="review-remove" type="button" data-review-index="${index}" aria-label="Delete review" title="Delete review">&times;</button><div class="review-card-content"><div class="review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}<span>${'★'.repeat(5 - review.rating)}</span></div><h3>${review.product}</h3><p>${review.comment}</p><span class="mono review-author">Customer review</span></div></article>`).join('');
	reviewList.querySelectorAll('[data-review-index]').forEach(button => button.addEventListener('click', () => {
		customerReviews.splice(Number(button.dataset.reviewIndex), 1);
		localStorage.setItem('gkart-reviews', JSON.stringify(customerReviews));
		renderReviews();
	}));
};

const loadVendorReviews = async accountId => {
	if (!reviewList || !accountId) return;
	try {
		const response = await fetch(`/api/vendor/reviews?accountId=${encodeURIComponent(accountId)}`);
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to load reviews.');
		const reviews = result.reviews || [];
		reviewEmpty.style.display = reviews.length ? 'none' : 'grid';
		reviewList.innerHTML = reviews.map(review => `<article class="review-card"><img src="${escapeHtml(review.productPhoto || 'placeholder.jpg')}" alt="${escapeHtml(review.productName)}"><div class="review-card-content"><div class="review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}<span>${'★'.repeat(5 - review.rating)}</span></div><h3>${escapeHtml(review.productName)}</h3><p>${escapeHtml(review.comment)}</p><span class="mono review-author">${escapeHtml(review.customerName)}</span></div></article>`).join('');
	} catch (error) {
		reviewEmpty.style.display = 'none';
		reviewList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

const loadVendorOrders = async accountId => {
	if (!vendorOrdersList || !accountId) return;
	try {
		const response = await fetch(`/api/vendor/orders?accountId=${encodeURIComponent(accountId)}`);
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to load orders.');
		const orders = result.orders || [];
		const pendingCount = orders.filter(order => order.status === 'pending' && ['cash on delivery', 'upi qr'].includes(order.paymentMethod)).length;
		vendorOrderBadge.hidden = pendingCount === 0;
		vendorOrderBadge.textContent = pendingCount;
		vendorOrdersList.innerHTML = orders.length ? orders.map(order => {
			const canConfirmPayment = ['cash on delivery', 'upi qr'].includes(order.paymentMethod);
			const actions = order.status !== 'cancelled' && order.status !== 'delivered' ? `<div class="vendor-order-actions">${canConfirmPayment && order.status === 'pending' ? '<button type="button" class="order-success-button" data-order-status="paid" data-order-id="' + order.id + '">Payment received</button>' : ''}<button type="button" class="order-delivered-button" data-order-status="delivered" data-order-id="${order.id}">Delivered</button><button type="button" class="order-failure-button" data-order-status="cancelled" data-order-id="${order.id}">Not successful</button></div>` : '';
			return `<article class="vendor-order-card"><div class="vendor-order-main"><span class="mono">${escapeHtml(order.paymentMethod)} · Payment ${escapeHtml(order.paymentStatus || 'pending')}</span><h3>${escapeHtml(order.productName)}</h3><p>Rs ${Number(order.amount).toFixed(2)} · Customer #${escapeHtml(order.customerId)}</p><p>${escapeHtml(order.deliveryAddress || 'No delivery address')} · ${escapeHtml(order.phone || 'No phone')}${order.alternatePhone ? ` · Alt: ${escapeHtml(order.alternatePhone)}` : ''}</p><p>Vendor payout: Rs ${Number(order.vendorPayout || 0).toFixed(2)} · Settlement ${escapeHtml(order.settlementStatus || 'held')}</p></div><div class="vendor-order-status"><strong class="order-status ${escapeHtml(order.status)}">${escapeHtml(order.status)}</strong>${actions}</div></article>`;
		}).join('') : '<p class="shop-results-status">No orders yet.</p>';
		vendorOrdersList.querySelectorAll('[data-order-status]').forEach(button => button.addEventListener('click', () => updateVendorOrder(button.dataset.orderId, button.dataset.orderStatus, accountId)));
	} catch (error) {
		vendorOrdersList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

const loadVendorDashboard = async accountId => {
	if (!accountId || !dashboardSales) return;
	try {
		const [ordersResponse, productsResponse] = await Promise.all([
			fetch(`/api/vendor/orders?accountId=${encodeURIComponent(accountId)}`),
			fetch(`/api/vendor/products?accountId=${encodeURIComponent(accountId)}`),
		]);
		const ordersResult = await readJsonResponse(ordersResponse);
		const productsResult = await readJsonResponse(productsResponse);
		if (!ordersResponse.ok) throw new Error(ordersResult.error || 'Unable to load dashboard orders.');
		if (!productsResponse.ok) throw new Error(productsResult.error || 'Unable to load dashboard products.');

		const orders = ordersResult.orders || [];
		const products = productsResult.products || [];
		const completedOrders = orders.filter(order => ['paid', 'delivered'].includes(order.status));
		const pendingOrders = orders.filter(order => order.status === 'pending');
		const revenue = completedOrders.reduce((total, order) => total + Number(order.amount || 0), 0);
		dashboardSales.textContent = completedOrders.length;
		dashboardRevenue.textContent = `Rs ${revenue.toFixed(2)}`;
		dashboardProducts.textContent = products.length;
		dashboardPending.textContent = pendingOrders.length;
	} catch (error) {
		dashboardSales.textContent = '-';
		dashboardRevenue.textContent = '-';
		dashboardProducts.textContent = '-';
		dashboardPending.textContent = '-';
	}
};

const updateVendorOrder = async (orderId, status, accountId) => {
	try {
		const response = await fetch(`/api/vendor/orders/${encodeURIComponent(orderId)}?accountId=${encodeURIComponent(accountId)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to update order.');
		loadVendorOrders(accountId);
		if (profileData.role === 'vendor') return;
	} catch (error) {
		vendorOrdersList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

renderReviews();

const renderItems = () => {
	itemGrid.innerHTML = Array.from({ length: 11 + extraSlots }, (_, index) => {
		if (index === 10 + extraSlots) return `<button class="item-slot add-box-slot" type="button" data-add-box="true"><span class="slot-index mono">${String(index + 1).padStart(2, '0')}</span><span class="slot-add"><span class="slot-plus">+</span><span>Add more boxes</span></span><span class="free-box-label mono">Free</span></button>`;
		const item = savedItems[index];
		const removeBoxButton = index >= 10 ? `<button class="slot-box-remove" type="button" data-remove-box="${index}" aria-label="Delete box" title="Delete box">&times;</button>` : '';
		if (!item) return `<button class="item-slot${index >= 10 ? ' extra-box-slot' : ''}" type="button" data-slot="${index}"><span class="slot-index mono">${String(index + 1).padStart(2, '0')}</span>${removeBoxButton}<span class="slot-add"><span class="slot-plus">+</span><span>Add item</span></span></button>`;
		const originalPrice = item.discount ? `<del>$${Number(item.price).toFixed(2)}</del>` : '';
		const finalPrice = item.discount ? (Number(item.price) * (1 - Number(item.discount) / 100)).toFixed(2) : Number(item.price).toFixed(2);
		return `<article class="item-slot filled" data-slot="${index}"><img class="slot-image" src="${item.image}" alt="${item.name}"><div class="slot-actions"><button class="slot-edit" type="button" data-slot="${index}">Edit</button><button class="slot-remove" type="button" data-remove-slot="${index}">Remove</button>${removeBoxButton}</div><div class="slot-details"><strong>${item.name}</strong><div class="slot-price">${originalPrice}<span>$${finalPrice}</span></div></div></article>`;
	}).join('');
	filledCount.textContent = savedItems.filter(Boolean).length;
	itemGrid.querySelectorAll('[data-slot]').forEach(slot => slot.addEventListener('click', event => { event.stopPropagation(); openItemModal(Number(slot.dataset.slot)); }));
	itemGrid.querySelectorAll('[data-remove-slot]').forEach(button => button.addEventListener('click', async event => {
		event.stopPropagation();
		const slot = Number(button.dataset.removeSlot);
		const accountId = localStorage.getItem('userId');
		if (accountId) await fetch(`/api/vendor/products/${slot}?accountId=${encodeURIComponent(accountId)}`, { method: 'DELETE' });
		savedItems[slot] = null;
		localStorage.setItem('gkart-items', JSON.stringify(savedItems));
		renderItems();
	}));
	itemGrid.querySelectorAll('[data-remove-box]').forEach(button => button.addEventListener('click', event => {
		event.stopPropagation();
		savedItems.splice(Number(button.dataset.removeBox), 1);
		extraSlots = Math.max(0, extraSlots - 1);
		localStorage.setItem('gkart-items', JSON.stringify(savedItems));
		localStorage.setItem('gkart-extra-slots', String(extraSlots));
		renderItems();
	}));
	itemGrid.querySelectorAll('[data-add-box]').forEach(slot => slot.addEventListener('click', () => {
		extraSlots += 1;
		localStorage.setItem('gkart-extra-slots', String(extraSlots));
		renderItems();
	}));
};

const openItemModal = slot => {
	selectedSlot = slot;
	const item = savedItems[slot];
	itemSlotNumber.textContent = String(slot + 1).padStart(2, '0');
	itemForm.reset();
	itemFormMessage.classList.remove('show');
	itemImage = item?.image || '';
	itemForm.itemName.value = item?.name || '';
	itemForm.itemPrice.value = item?.price || '';
	itemForm.itemDiscount.value = item?.discount || '';
	itemDescription.value = item?.description || '';
	itemPhoto.required = !item;
	itemPhotoName.textContent = item ? 'Current photo kept unless replaced' : 'JPG, PNG, or WEBP';
	photoFrame.classList.toggle('has-image', Boolean(itemImage));
	photoFrame.style.backgroundImage = itemImage ? `url("${itemImage}")` : '';
	itemModal.classList.add('open');
	document.getElementById('itemName').focus();
};

itemPhoto.addEventListener('change', () => {
	const file = itemPhoto.files[0];
	if (!file) return;
	itemPhotoName.textContent = file.name;
	const reader = new FileReader();
	reader.addEventListener('load', () => {
		itemImage = reader.result;
		photoFrame.classList.add('has-image');
		photoFrame.style.backgroundImage = `url("${itemImage}")`;
	});
	reader.readAsDataURL(file);
});

document.getElementById('closeItemModal').addEventListener('click', () => itemModal.classList.remove('open'));
itemModal.addEventListener('click', event => { if (event.target === itemModal) itemModal.classList.remove('open'); });
itemForm.addEventListener('submit', async event => {
	event.preventDefault();
	if (!itemImage) {
		itemFormMessage.textContent = 'Please choose a product photo.';
		itemFormMessage.classList.add('show');
		return;
	}
	const accountId = localStorage.getItem('userId');
	if (!accountId) {
		itemFormMessage.textContent = 'Please sign in again before adding products.';
		itemFormMessage.classList.add('show');
		return;
	}
	const description = itemDescription.value.trim();
	if (description.split(/\s+/).filter(Boolean).length > 200) {
		itemFormMessage.textContent = 'Product description must be 200 words or fewer.';
		itemFormMessage.classList.add('show');
		return;
	}
	const product = { name: itemForm.itemName.value.trim(), price: itemForm.itemPrice.value, discount: itemForm.itemDiscount.value || 0, description, image: itemImage };
	try {
		const response = await fetch('/api/vendor/products', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ accountId, slot: selectedSlot, ...product, photo: product.image }),
		});
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to save product.');
	} catch (error) {
		itemFormMessage.textContent = error.message;
		itemFormMessage.classList.add('show');
		return;
	}
	savedItems[selectedSlot] = product;
	localStorage.setItem('gkart-items', JSON.stringify(savedItems));
	renderItems();
	itemModal.classList.remove('open');
});

document.addEventListener('keydown', event => {
	if (event.key === 'Escape') {
		itemModal.classList.remove('open');
		profileEditModal.classList.remove('open');
		shopProductsModal.classList.remove('open');
		if (customerStoresPage.classList.contains('active')) showCustomerPage('customerHome');
	}
	if (event.key === 'Backspace' && shopProductsModal.classList.contains('open') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
		event.preventDefault();
		shopProductsModal.classList.remove('open');
		window.scrollTo(0, 0);
	}
	if (event.key === 'Backspace' && customerStoresPage.classList.contains('active') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
		event.preventDefault();
		showCustomerPage('customerHome');
	}
});
renderItems();

const clearNavActive = () => document.querySelectorAll('.static-nav-links a').forEach(navLink => navLink.classList.remove('active'));
const hideContentViews = () => {
	productBoard.classList.add('dashboard-hidden');
	salesDashboard.classList.remove('dashboard-visible');
	vendorOrdersView.classList.remove('vendor-orders-visible');
	reviewsView.classList.remove('reviews-visible');
	reportView.classList.remove('report-visible');
	profileView.classList.remove('profile-visible');
};

dashboardLink.addEventListener('click', event => {
	event.preventDefault();
	history.replaceState(null, '', '#salesDashboard');
	pageTransition.classList.add('dashboard-transition');
	pageTransition.classList.remove('active');
	void pageTransition.offsetWidth;
	pageTransition.classList.add('active');
	productBoard.classList.add('dashboard-hidden');
	salesDashboard.classList.add('dashboard-visible');
	vendorOrdersView.classList.remove('vendor-orders-visible');
	reviewsView.classList.remove('reviews-visible');
	reportView.classList.remove('report-visible');
	profileView.classList.remove('profile-visible');
	clearNavActive();
	dashboardLink.classList.add('active');
	loadVendorDashboard(profileData.id);
	setTimeout(() => salesDashboard.scrollIntoView({ behavior: 'instant', block: 'start' }), 430);
});

homeLink.addEventListener('click', event => {
	event.preventDefault();
	history.replaceState(null, '', '#guestView');
	playPageTransition();
	productBoard.classList.remove('dashboard-hidden');
	salesDashboard.classList.remove('dashboard-visible');
	vendorOrdersView.classList.remove('vendor-orders-visible');
	reviewsView.classList.remove('reviews-visible');
	reportView.classList.remove('report-visible');
	profileView.classList.remove('profile-visible');
	clearNavActive();
	homeLink.classList.add('active');
	document.getElementById('guestView').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.static-nav-links a').forEach(link => {
	if (link === homeLink || link === dashboardLink) return;
	link.addEventListener('click', event => {
		event.preventDefault();
		history.replaceState(null, '', link.getAttribute('href'));
		playPageTransition();
		clearNavActive();
		link.classList.add('active');
		if (link.getAttribute('href') === '#reviews') {
			hideContentViews();
			reviewsView.classList.add('reviews-visible');
		}
		if (link.getAttribute('href') === '#vendorOrders') {
			hideContentViews();
			vendorOrdersView.classList.add('vendor-orders-visible');
			loadVendorOrders(profileData.id);
		}
		if (link.getAttribute('href') === '#report') {
			hideContentViews();
			reportView.classList.add('report-visible');
			commentForm.classList.remove('visible');
			commentForm.reset();
			bugForm.classList.remove('visible');
			bugForm.reset();
			bugScreenshotName.textContent = 'Add a screenshot';
			customerForm.classList.remove('visible');
			customerForm.reset();
			chatbotShell.appendChild(commentForm);
			chatbotShell.appendChild(bugForm);
			chatbotMessages.innerHTML = '';
			chatbotChoices.classList.remove('visible');
			usedQuestions.clear();
			questionButtons.forEach(button => { button.hidden = false; });
			showBotResponse('Hi sir, how can I help you?', () => chatbotChoices.classList.add('visible'));
		}
		if (link === profileLink) {
			hideContentViews();
			profileView.classList.add('profile-visible');
			renderProfile();
		}
		const target = document.querySelector(link.getAttribute('href'));
		if (target) setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 430);
	});
});

document.getElementById('openProfileEdit').addEventListener('click', () => {
	profileEditForm.reset();
	profileEditForm.editName.value = profileData.name;
	profileEditForm.editEmail.value = profileData.email;
	profileEditForm.editPhone.value = profileData.phone;
	profileEditForm.editCity.value = profileData.city;
	profileEditForm.editVendorAddress.value = profileData.vendorAddress || '';
	editUpiId.value = profileData.upiId || '';
	editUpiQrName.textContent = 'Leave unchanged if not replacing';
	profileEditMessage.classList.remove('show');
	editPhotoName.textContent = 'Leave unchanged if not replacing';
	profileEditModal.classList.add('open');
});

profileQrAction?.addEventListener('click', () => document.getElementById('openProfileEdit').click());

if (!editUpiId) {
	const upiIdField = document.createElement('div');
	upiIdField.className = 'field full';
	upiIdField.innerHTML = '<label class="mono" for="editUpiId">UPI ID for exact-amount payments</label><input id="editUpiId" name="editUpiId" type="text" placeholder="yourname@upi">';
	profileEditForm.insertBefore(upiIdField, profileEditForm.querySelector('.profile-edit-form .submit-form') || profileEditForm.lastElementChild);
	editUpiId = upiIdField.querySelector('#editUpiId');
}

document.getElementById('closeProfileEdit').addEventListener('click', () => profileEditModal.classList.remove('open'));
profileEditModal.addEventListener('click', event => { if (event.target === profileEditModal) profileEditModal.classList.remove('open'); });
editPhoto.addEventListener('change', () => { editPhotoName.textContent = editPhoto.files[0]?.name || 'Leave unchanged if not replacing'; });
editUpiQr.addEventListener('change', () => { editUpiQrName.textContent = editUpiQr.files[0]?.name || 'Leave unchanged if not replacing'; });
profileEditForm.addEventListener('submit', async event => {
	event.preventDefault();
	const saveProfile = async (image, upiQr) => {
		const updatedData = {
			id: localStorage.getItem('userId'),
			fullName: profileEditForm.editName.value.trim(),
			phone: profileEditForm.editPhone.value.trim(),
			vendorAddress: profileEditForm.editVendorAddress.value.trim(),
			city: profileEditForm.editCity.value.trim(),
			photo: image || profileData.image || '',
			upiQr: upiQr || profileData.upiQr || '',
			upiId: editUpiId.value.trim(),
		};
		const submitButton = profileEditForm.querySelector('.submit-form');
		submitButton.disabled = true;
		profileEditMessage.classList.remove('show');
		try {
			const response = await fetch('/api/vendor/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(updatedData),
			});
			const result = await readJsonResponse(response);
			if (!response.ok) throw new Error(result.error || 'Unable to update your profile.');
			const account = result.account;
			profileData = { id: account.id, name: account.fullName, phone: account.phone, email: account.email, city: account.city, vendorAddress: account.vendorAddress, upiQr: account.upiQr, upiId: account.upiId, image: account.photo, password: '', role: account.role };
			localStorage.setItem('gkart-profile', JSON.stringify(profileData));
			localStorage.setItem('userId', String(account.id));
			renderProfile();
			profileEditModal.classList.remove('open');
		} catch (error) {
			profileEditMessage.textContent = error.message;
			profileEditMessage.classList.add('show');
		} finally {
			submitButton.disabled = false;
		}
	};
	const readFile = file => new Promise(resolve => {
		if (!file) { resolve(''); return; }
		const reader = new FileReader();
		reader.addEventListener('load', () => resolve(reader.result));
		reader.readAsDataURL(file);
	});
	Promise.all([readFile(editPhoto.files[0]), readFile(editUpiQr.files[0])]).then(([image, upiQr]) => saveProfile(image, upiQr));
});

const botReplies = {
	bug: 'Thank you for reporting the bug. Please share any details or screenshots, and our team will investigate it.',
	spam: 'Thank you for reporting spam. We will review the account or message and take the appropriate action.',
	customer: 'Please tell us which customer you want to report and what happened. Our team will review the report.'
};

const showBotResponse = (message, afterResponse) => {
	const typingMessage = document.createElement('div');
	typingMessage.className = 'chat-message bot';
	typingMessage.innerHTML = '<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><span class="typing-dots" aria-label="Chatbot is typing"><i></i><i></i><i></i></span></div>';
	chatbotMessages.appendChild(typingMessage);
	chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
	setTimeout(() => {
		typingMessage.innerHTML = `<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><p>${message}</p></div>`;
		chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
		if (afterResponse) afterResponse();
	}, 2000);
};

const resetQuestionsIfComplete = () => {
	if (usedQuestions.size !== questionButtons.length) return;
	usedQuestions.clear();
	questionButtons.forEach(button => { button.hidden = false; });
};

questionButtons.forEach(button => button.addEventListener('click', () => {
	const question = button.dataset.question;
	if (usedQuestions.has(question)) return;
	usedQuestions.add(question);
	button.hidden = true;
	const userMessage = document.createElement('div');
	userMessage.className = 'chat-message user';
	userMessage.innerHTML = `<div><small class="mono">You</small><p>${button.textContent}</p></div>`;
	chatbotMessages.appendChild(userMessage);
	if (question === 'other') {
		bugForm.classList.remove('visible');
		showBotResponse('Please write your comment below, and our team will review it.', () => {
			chatbotShell.insertBefore(commentForm, chatbotChoices);
			commentForm.classList.add('visible');
			reportComment.focus();
			resetQuestionsIfComplete();
		});
		return;
	}
	if (question === 'bug') {
		commentForm.classList.remove('visible');
		commentForm.reset();
		customerForm.classList.remove('visible');
		customerForm.reset();
		showBotResponse(botReplies[question], () => {
			chatbotShell.insertBefore(bugForm, chatbotChoices);
			bugForm.classList.add('visible');
			resetQuestionsIfComplete();
		});
		return;
	}
	if (question === 'customer') {
		commentForm.classList.remove('visible');
		commentForm.reset();
		bugForm.classList.remove('visible');
		bugForm.reset();
		chatbotShell.insertBefore(customerForm, chatbotChoices);
		customerForm.classList.add('visible');
		customerForm.querySelector('input').focus();
		showBotResponse(botReplies[question], resetQuestionsIfComplete);
		return;
	}
	showBotResponse(botReplies[question], resetQuestionsIfComplete);
}));

bugScreenshot.addEventListener('change', () => { bugScreenshotName.textContent = bugScreenshot.files[0]?.name || 'Add a screenshot'; });

bugForm.addEventListener('submit', event => {
	event.preventDefault();
	bugForm.reset();
	bugForm.classList.remove('visible');
	bugScreenshotName.textContent = 'Add a screenshot';
	showBotResponse('Your bug report and screenshot have been received. Thank you for helping us improve.');
});

commentForm.addEventListener('submit', event => {
	event.preventDefault();
	commentForm.reset();
	commentForm.classList.remove('visible');
	showBotResponse('Your comment has been received. Thank you for helping us improve.');
});

customerForm.addEventListener('submit', event => {
	event.preventDefault();
	customerForm.reset();
	customerForm.classList.remove('visible');
	showBotResponse('Your customer report has been received. Our team will review what happened.');
});

if (customerChatbotMessages && customerChatbotChoices && customerCommentForm && customerBugForm && customerCustomerForm) {
	const customerUsedQuestions = new Set();
	const customerBotReplies = {
		bug: 'Thank you for reporting the bug. Please share any details or screenshots, and our team will investigate it.',
		spam: 'Thank you for reporting spam. We will review the account or message and take the appropriate action.',
		customer: 'Please tell us which customer you want to report and what happened. Our team will review the report.'
	};
	const customerResetQuestionsIfComplete = () => {
		if (customerUsedQuestions.size !== customerQuestionButtons.length) return;
		customerUsedQuestions.clear();
		customerQuestionButtons.forEach(button => { button.hidden = false; });
	};
	const customerShowBotResponse = (message, afterResponse) => {
		const typingMessage = document.createElement('div');
		typingMessage.className = 'chat-message bot';
		typingMessage.innerHTML = '<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><span class="typing-dots" aria-label="Chatbot is typing"><i></i><i></i><i></i></span></div>';
		customerChatbotMessages.appendChild(typingMessage);
		customerChatbotMessages.scrollTop = customerChatbotMessages.scrollHeight;
		setTimeout(() => {
			typingMessage.innerHTML = `<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><p>${message}</p></div>`;
			customerChatbotMessages.scrollTop = customerChatbotMessages.scrollHeight;
			if (afterResponse) afterResponse();
		}, 2000);
	};
	const customerResetChatbot = () => {
		customerCommentForm.classList.remove('visible');
		customerCommentForm.reset();
		customerBugForm.classList.remove('visible');
		customerBugForm.reset();
		customerCustomerForm.classList.remove('visible');
		customerCustomerForm.reset();
		customerChatbotShell.appendChild(customerCommentForm);
		customerChatbotShell.appendChild(customerBugForm);
		customerChatbotShell.appendChild(customerCustomerForm);
		customerChatbotMessages.innerHTML = '';
		customerChatbotChoices.classList.remove('visible');
		customerUsedQuestions.clear();
		customerQuestionButtons.forEach(button => { button.hidden = false; });
		customerShowBotResponse('Hi sir, how can I help you?', () => customerChatbotChoices.classList.add('visible'));
	};
	customerQuestionButtons.forEach(button => button.addEventListener('click', () => {
		const question = button.dataset.question;
		if (customerUsedQuestions.has(question)) return;
		customerUsedQuestions.add(question);
		button.hidden = true;
		const userMessage = document.createElement('div');
		userMessage.className = 'chat-message user';
		userMessage.innerHTML = `<div><small class="mono">You</small><p>${button.textContent}</p></div>`;
		customerChatbotMessages.appendChild(userMessage);
		if (question === 'other') {
			customerBugForm.classList.remove('visible');
			customerShowBotResponse('Please write your comment below, and our team will review it.', () => {
				customerChatbotShell.insertBefore(customerCommentForm, customerChatbotChoices);
				customerCommentForm.classList.add('visible');
				customerReportComment.focus();
				customerResetQuestionsIfComplete();
			});
			return;
		}
		if (question === 'bug') {
			customerCommentForm.classList.remove('visible');
			customerCommentForm.reset();
			customerCustomerForm.classList.remove('visible');
			customerCustomerForm.reset();
			customerShowBotResponse(customerBotReplies[question], () => {
				customerChatbotShell.insertBefore(customerBugForm, customerChatbotChoices);
				customerBugForm.classList.add('visible');
				customerResetQuestionsIfComplete();
			});
			return;
		}
		if (question === 'customer') {
			customerCommentForm.classList.remove('visible');
			customerCommentForm.reset();
			customerBugForm.classList.remove('visible');
			customerBugForm.reset();
			customerChatbotShell.insertBefore(customerCustomerForm, customerChatbotChoices);
			customerCustomerForm.classList.add('visible');
			customerCustomerForm.querySelector('input').focus();
			customerShowBotResponse(customerBotReplies[question], customerResetQuestionsIfComplete);
			return;
		}
		customerShowBotResponse(customerBotReplies[question], customerResetQuestionsIfComplete);
	}));
	customerBugScreenshot.addEventListener('change', () => { customerBugScreenshotName.textContent = customerBugScreenshot.files[0]?.name || 'Add a screenshot'; });
	customerBugForm.addEventListener('submit', event => {
		event.preventDefault();
		customerBugForm.reset();
		customerBugForm.classList.remove('visible');
		customerBugScreenshotName.textContent = 'Add a screenshot';
		customerShowBotResponse('Your bug report and screenshot have been received. Thank you for helping us improve.');
	});
	customerCommentForm.addEventListener('submit', event => {
		event.preventDefault();
		customerCommentForm.reset();
		customerCommentForm.classList.remove('visible');
		customerShowBotResponse('Your comment has been received. Thank you for helping us improve.');
	});
	customerCustomerForm.addEventListener('submit', event => {
		event.preventDefault();
		customerCustomerForm.reset();
		customerCustomerForm.classList.remove('visible');
		customerShowBotResponse('Your customer report has been received. Our team will review what happened.');
	});
	customerResetChatbot();
}

const showHomeView = (isVendor, showCustomerVideo = false) => {
	document.body.classList.add('guest-mode');
	document.body.classList.toggle('vendor-mode', isVendor);
	guestView.classList.toggle('vendor-view', isVendor);
	customerHome.classList.toggle('active', !isVendor);
	customerHome.classList.toggle('show-video-intro', !isVendor && showCustomerVideo);
	landingHeader.style.display = 'none';
	document.querySelector('main').style.display = 'none';
	guestView.classList.add('active');
	replayBoardHeadline();
};

const customerOffers = [
	{ badge: 'Today only', title: 'Clay & Co.', description: '10% off handmade dinnerware and ceramic mugs for the next 6 hours.', price: 'Rs 540', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=900&q=80', location: '2 min away' },
	{ badge: 'Fresh picks', title: 'Green Row Market', description: 'Free local delivery on seasonal fruit boxes and pantry bundles this afternoon.', price: 'Rs 980', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80', location: '5 min away' },
	{ badge: 'Weekend deal', title: 'Thread & Loom', description: 'Buy 2 home textiles and save 15% on woven table linens and pillows.', price: 'Rs 760', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80', location: '8 min away' }
];

const renderCustomerOffers = async () => {
	if (!customerOffersList) return;
	try {
		const response = await fetch('/api/shops/offers');
		const data = await readJsonResponse(response);
		if (!response.ok) throw new Error(data.error || 'Unable to load offers.');
		const offers = data.offers || [];
		if (!offers.length) {
			customerOffersList.innerHTML = '<div class="customer-offer-empty"><div><h3>No offers for today</h3><p>Vendors have not added discounted products yet.</p></div></div>';
			return;
		}
		customerOffersList.innerHTML = offers.map(offer => {
			const finalPrice = Number(offer.price) * (1 - Number(offer.discount) / 100);
			return `
		<article class="customer-offer-card">
			<div class="customer-offer-image" style="background-image: linear-gradient(135deg, rgba(16,32,39,.08), rgba(16,32,39,.18)), url('${escapeHtml(offer.photo)}')"></div>
			<div class="customer-offer-info">
				<span class="customer-offer-badge mono">${escapeHtml(offer.discount)}% off</span>
				<h3>${escapeHtml(offer.name)}</h3>
				<p>${escapeHtml(offer.storeName)} · ${escapeHtml(offer.description || '')}</p>
				<div class="customer-offer-meta">
					<strong><del>Rs ${Number(offer.price).toFixed(2)}</del> Rs ${finalPrice.toFixed(2)}</strong>
					<span>${escapeHtml(offer.storeName)}</span>
				</div>
			</div>
			<button class="customer-offer-action mono" type="button">View store</button>
		</article>
			`;
		}).join('');
	} catch (error) {
		customerOffersList.innerHTML = `<div class="customer-offer-empty"><div><h3>${escapeHtml(error.message)}</h3></div></div>`;
	}
};

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
	'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
}[character]));

let cartNoticeTimer;
const showCartNotice = message => {
	cartNotice.textContent = message;
	cartNotice.classList.add('show');
	clearTimeout(cartNoticeTimer);
	cartNoticeTimer = setTimeout(() => cartNotice.classList.remove('show'), 2600);
};

const renderCart = () => {
	if (!customerCartList) return;
	customerCartList.innerHTML = cartItems.length ? cartItems.map(item => `<article class="customer-cart-item" data-cart-product='${escapeHtml(JSON.stringify(item))}' tabindex="0" role="button"><img class="customer-cart-thumb" src="${escapeHtml(item.photo)}" alt="${escapeHtml(item.name)}"><div class="customer-cart-copy"><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.storeName)}</p></div><div class="customer-cart-meta"><strong>Rs ${Number(item.finalPrice).toFixed(2)}</strong><span>Qty 1</span><button class="cart-remove" type="button" data-remove-cart="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.name)} from cart" title="Remove from cart">&times;</button></div></article>`).join('') : '<p class="shop-results-status">Your cart is empty. Do check the products.</p>';
	const total = cartItems.reduce((sum, item) => sum + Number(item.finalPrice), 0);
	cartTotal.textContent = `Rs ${total.toFixed(2)}`;
	customerCartList.querySelectorAll('[data-remove-cart]').forEach(button => button.addEventListener('click', event => {
		event.stopPropagation();
		cartItems = cartItems.filter(item => String(item.id) !== button.dataset.removeCart);
		localStorage.setItem('gkart-cart', JSON.stringify(cartItems));
		renderCart();
	}));
	customerCartList.querySelectorAll('[data-cart-product]').forEach(row => {
		const openDetails = () => openProductDetails(JSON.parse(row.dataset.cartProduct));
		row.addEventListener('click', openDetails);
		row.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDetails(); } });
	});
};

const addToCart = product => {
	if (cartItems.some(item => String(item.id) === String(product.id))) {
		showCartNotice("You've already added the product.");
		return;
	}
	const finalPrice = Number(product.price) * (1 - Number(product.discount) / 100);
	cartItems.push({ ...product, finalPrice });
	localStorage.setItem('gkart-cart', JSON.stringify(cartItems));
	renderCart();
	showCartNotice('Product added to your cart.');
};

renderCart();

const getCartTotals = () => {
	const original = cartItems.reduce((sum, item) => sum + Number(item.price), 0);
	const total = cartItems.reduce((sum, item) => sum + Number(item.finalPrice), 0);
	return { original, discount: original - total, total };
};

const renderCheckout = async () => {
	if (!checkoutItems.length) {
		checkoutSummary.innerHTML = '<p class="shop-results-status">Your cart is empty. Add a product before checkout.</p>';
		return;
	}
	const original = checkoutItems.reduce((sum, item) => sum + Number(item.price), 0);
	const total = checkoutItems.reduce((sum, item) => sum + Number(item.finalPrice ?? Number(item.price) * (1 - Number(item.discount) / 100)), 0);
	const totals = { original, discount: original - total, total };
	const stores = [...new Map(checkoutItems.map(item => [item.vendorId || item.storeName, item])).values()];
	checkoutSummary.innerHTML = `<div class="checkout-total-lines"><div><span>Amount</span><strong>Rs ${totals.original.toFixed(2)}</strong></div><div><span>Discount</span><strong>- Rs ${totals.discount.toFixed(2)}</strong></div><div class="total"><span>Total cost</span><strong>Rs ${totals.total.toFixed(2)}</strong></div></div><p class="checkout-payment-note">Scan the QR code and pay the exact total shown above. Confirmation opens after payment is verified.</p><div class="checkout-store-qrs"><span class="mono">Store payment QR</span>${stores.map(store => `<div class="checkout-store-qr"><span>${escapeHtml(store.storeName)}</span><img src="${escapeHtml(store.upiQr || '')}" alt="${escapeHtml(store.storeName)} payment QR code" data-upi-id="${escapeHtml(store.upiId || '')}" data-store-name="${escapeHtml(store.storeName)}"></div>`).join('')}</div>`;
	checkoutSummary.querySelectorAll('.checkout-store-qr img').forEach(image => image.addEventListener('click', () => { qrViewerImage.src = image.src; qrViewer.classList.add('open'); }));
	await Promise.all([...checkoutSummary.querySelectorAll('[data-upi-id]')].map(async image => {
		if (!image.dataset.upiId) return;
		const storeTotal = checkoutItems.filter(item => String(item.vendorId || item.storeName) === String(stores.find(store => store.storeName === image.dataset.storeName)?.vendorId || image.dataset.storeName)).reduce((sum, item) => sum + Number(item.finalPrice ?? Number(item.price) * (1 - Number(item.discount) / 100)), 0);
		try {
			const response = await fetch('/api/payments/upi/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ upiId: image.dataset.upiId, name: image.dataset.storeName, amount: storeTotal }) });
			const result = await readJsonResponse(response);
			if (response.ok) image.src = result.qr;
		} catch (error) { console.error(error); }
	}));
};

const resetCheckoutDetails = () => {
	checkoutMethod = '';
	checkoutDeliveryForm.reset();
	checkoutMessage.textContent = '';
};

const openCheckoutForItems = async (items, method = '', fromCart = false) => {
	checkoutItems = items;
	checkoutFromCart = fromCart;
	productDetailModal.classList.remove('open');
	shopProductsModal.classList.remove('open');
	resetCheckoutDetails();
	await renderCheckout();
	checkoutModal.classList.add('open');
	if (method) showDeliveryStep(method);
};

const showDeliveryStep = method => {
	checkoutMethod = method;
	checkoutMethodLabel.textContent = `${method} payment · Delivery details`;
	checkoutModal.classList.remove('open');
	deliveryModal.classList.add('open');
	checkoutAddress.focus();
};

openCheckout?.addEventListener('click', async () => { await openCheckoutForItems(cartItems, '', true); });
document.getElementById('closeCheckout')?.addEventListener('click', () => checkoutModal.classList.remove('open'));
checkoutModal?.addEventListener('click', event => { if (event.target === checkoutModal) checkoutModal.classList.remove('open'); });
document.getElementById('closeDelivery')?.addEventListener('click', () => deliveryModal.classList.remove('open'));
deliveryModal?.addEventListener('click', event => { if (event.target === deliveryModal) deliveryModal.classList.remove('open'); });

checkoutCod?.addEventListener('click', () => showDeliveryStep('Cash on delivery'));
checkoutQrPaid?.addEventListener('click', () => showDeliveryStep('QR code'));
checkoutRazorpay?.addEventListener('click', () => showDeliveryStep('Razorpay'));

const processCashOnDelivery = async () => {
	const customerId = localStorage.getItem('userId');
	if (profileData.role !== 'customer' || !customerId) { checkoutMessage.textContent = 'Please sign in as a customer before ordering.'; return; }
	try {
		const reviewProduct = checkoutItems[0];
		await Promise.all(checkoutItems.map(item => fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, productId: item.id, paymentMethod: 'cash on delivery', status: 'pending', deliveryAddress: checkoutAddress.value.trim(), phone: checkoutPhone.value.trim(), alternatePhone: checkoutAlternatePhone.value.trim() }) })));
		checkoutMessage.textContent = 'Cash-on-delivery order placed.';
		if (checkoutFromCart) {
			cartItems = [];
			localStorage.setItem('gkart-cart', JSON.stringify(cartItems));
			renderCart();
		}
		loadOrderHistory(customerId);
		showPaymentSuccess('Order confirmed.', 'Your cash-on-delivery order has been added to your order history.', reviewProduct);
 	} catch (error) { checkoutMessage.textContent = error.message; }
};

const processQrPayment = async () => {
	const customerId = localStorage.getItem('userId');
	if (profileData.role !== 'customer' || !customerId) { checkoutMessage.textContent = 'Please sign in as a customer before ordering.'; return; }
	try {
		const reviewProduct = checkoutItems[0];
		const responses = await Promise.all(checkoutItems.map(item => fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, productId: item.id, paymentMethod: 'upi qr', status: 'pending', deliveryAddress: checkoutAddress.value.trim(), phone: checkoutPhone.value.trim(), alternatePhone: checkoutAlternatePhone.value.trim() }) })));
		const results = await Promise.all(responses.map(readJsonResponse));
		if (results.some((result, index) => !responses[index].ok)) throw new Error('Unable to record the QR payment.');
		if (checkoutFromCart) {
			cartItems = [];
			localStorage.setItem('gkart-cart', JSON.stringify(cartItems));
			renderCart();
		}
		loadOrderHistory(customerId);
		checkoutMessage.textContent = 'Payment submitted. Waiting for confirmation...';
		pollQrPaymentConfirmation(customerId, results.map(result => result.order?.id).filter(Boolean), reviewProduct);
 	} catch (error) { checkoutMessage.textContent = error.message; }
};

const pollQrPaymentConfirmation = (customerId, orderIds, reviewProduct, attempts = 0) => {
	if (!orderIds.length || attempts >= 30) return;
	setTimeout(async () => {
		try {
			const response = await fetch(`/api/orders?customerId=${encodeURIComponent(customerId)}`);
			const result = await readJsonResponse(response);
			const matchedOrders = (result.orders || []).filter(order => orderIds.includes(order.id));
			if (matchedOrders.length === orderIds.length && matchedOrders.every(order => ['paid', 'delivered'].includes(order.status))) {
				loadOrderHistory(customerId);
				showPaymentSuccess('Payment confirmed.', 'Your QR payment was confirmed and the order is now being processed.', reviewProduct);
				return;
			}
		} catch (error) {
			console.error(error);
		}
		pollQrPaymentConfirmation(customerId, orderIds, reviewProduct, attempts + 1);
	}, 2000);
};

const processRazorpayPayment = async () => {
	const customerId = localStorage.getItem('userId');
	if (profileData.role !== 'customer' || !customerId) { checkoutMessage.textContent = 'Please sign in as a customer before ordering.'; return; }
	const total = checkoutItems.reduce((sum, item) => sum + Number(item.finalPrice ?? Number(item.price) * (1 - Number(item.discount) / 100)), 0);
	try {
		const reviewProduct = checkoutItems[0];
		const response = await fetch('/api/payments/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: total, productId: checkoutItems[0].id, customerId }) });
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to start Razorpay checkout.');
		new window.Razorpay({ key: result.keyId, amount: result.order.amount, currency: result.order.currency, name: 'gKart', description: 'Cart purchase', order_id: result.order.id, handler: async payment => {
			const verifyResponse = await fetch('/api/payments/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payment, order: { customerId, productIds: checkoutItems.map(item => item.id), deliveryAddress: checkoutAddress.value.trim(), phone: checkoutPhone.value.trim(), alternatePhone: checkoutAlternatePhone.value.trim() } }) });
			const verifyResult = await readJsonResponse(verifyResponse);
			if (!verifyResponse.ok) throw new Error(verifyResult.error || 'Payment verification failed.');
			checkoutMessage.textContent = verifyResult.message;
			if (checkoutFromCart) {
				cartItems = [];
				localStorage.setItem('gkart-cart', JSON.stringify(cartItems));
				renderCart();
			}
			loadOrderHistory(customerId);
			showPaymentSuccess('Payment successful.', 'Your order has been added to your order history.', reviewProduct);
		} }).open();
	} catch (error) { checkoutMessage.textContent = error.message; }
};

checkoutDeliveryForm?.addEventListener('submit', event => {
	event.preventDefault();
	if (!checkoutAddress.value.trim() || !checkoutPhone.value.trim() || !checkoutAlternatePhone.value.trim()) {
		checkoutMessage.textContent = 'Please complete your address and both phone numbers.';
		return;
	}
	confirmPaymentDialog.classList.add('open');
});
closeConfirmPayment?.addEventListener('click', () => confirmPaymentDialog.classList.remove('open'));
confirmPaymentNo?.addEventListener('click', () => confirmPaymentDialog.classList.remove('open'));
confirmPaymentYes?.addEventListener('click', async () => {
	confirmPaymentYes.disabled = true;
	confirmPaymentDialog.classList.remove('open');
	deliveryModal.classList.remove('open');
	try {
		if (checkoutMethod === 'Cash on delivery') await processCashOnDelivery();
		if (checkoutMethod === 'QR code') await processQrPayment();
		if (checkoutMethod === 'Razorpay') await processRazorpayPayment();
	} finally { confirmPaymentYes.disabled = false; }
});

const renderShopCards = (shops, emptyMessage) => shops.length ? shops.map(shop => `
	<article class="available-shop-card" data-vendor-id="${escapeHtml(shop.id)}" tabindex="0" role="button">
		<img src="${escapeHtml(shop.photo || 'placeholder.jpg')}" alt="${escapeHtml(shop.fullName)}">
		<div><h3>${escapeHtml(shop.fullName)}</h3><p>${escapeHtml(shop.city)} - ${escapeHtml(shop.vendorAddress)}</p>${shop.matchingProducts?.length ? `<p class="shop-match">Products: ${shop.matchingProducts.map(product => escapeHtml(product.name)).join(', ')}</p>` : ''}<p>Phone: ${escapeHtml(shop.phone)}</p></div>
	</article>
`).join('') : `<p class="shop-results-status">${emptyMessage}</p>`;

const renderSearchResults = (shops, emptyMessage) => {
	if (!shops.length) return `<p class="shop-results-status">${emptyMessage}</p>`;
	return shops.map(shop => {
		if (!shop.matchingProducts?.length) return renderShopCards([shop], '');
		return shop.matchingProducts.map(product => `<article class="search-product-card" data-product='${escapeHtml(JSON.stringify(product))}' tabindex="0" role="button">
			<img src="${escapeHtml(product.photo || 'placeholder.jpg')}" alt="${escapeHtml(product.name)}">
			<div><span class="mono">${escapeHtml(shop.fullName)}</span><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || 'Available from this local shop.')}</p><strong>Rs ${Number(product.price).toFixed(2)}</strong></div>
		</article>`).join('');
	}).join('');
};

const renderNearbyShops = (shops, emptyMessage) => shops.length ? shops.map(shop => `
	<article class="customer-nearby-card" data-vendor-id="${escapeHtml(shop.id)}" tabindex="0" role="button">
		<div class="customer-nearby-visual"${shop.photo ? ` style="background-image: url('${escapeHtml(shop.photo)}')"` : ''}></div>
		<div class="customer-nearby-info">
			<span class="mono">${escapeHtml(shop.city || 'Local shop')}</span>
			<h3>${escapeHtml(shop.fullName)}</h3>
			<p>${escapeHtml(shop.vendorAddress || 'A local shop near you.')}</p>
			<a class="nearby-map-link mono" data-map-link href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${shop.vendorAddress || ''}, ${shop.city || ''}`)}" target="_blank" rel="noopener noreferrer">Open in Google Maps <span aria-hidden="true">↗</span></a>
		</div>
		<strong>View shop <span aria-hidden="true">↗</span></strong>
	</article>
`).join('') : `<p class="shop-results-status">${emptyMessage}</p>`;

const showVendorProducts = async vendorId => {
	shopProductsModal.classList.add('open');
	shopProductsTitle.textContent = 'Available products';
	shopProductsAddress.textContent = '';
	shopProductsList.innerHTML = '<p class="shop-results-status">Loading products...</p>';
	try {
		const response = await fetch(`/api/shops/${encodeURIComponent(vendorId)}/products`);
		const data = await readJsonResponse(response);
		if (!response.ok) throw new Error(data.error || 'Unable to load products.');
		shopProductsTitle.textContent = data.shop.fullName;
		shopProductsAddress.textContent = `${data.shop.city} · ${data.shop.vendorAddress}`;
		const products = data.products || [];
		shopProductsList.innerHTML = products.length ? products.map(product => {
			const finalPrice = Number(product.price) * (1 - Number(product.discount) / 100);
			const addedClass = cartItems.some(item => String(item.id) === String(product.id)) ? ' added' : '';
			return `<article class="product-card" data-product='${escapeHtml(JSON.stringify(product))}' tabindex="0" role="button"><button class="add-to-cart${addedClass}" type="button" data-add-cart aria-label="Add ${escapeHtml(product.name)} to cart" data-tooltip="Add to cart">&#128722;</button><img src="${escapeHtml(product.photo)}" alt="${escapeHtml(product.name)}"><div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || '')}</p><p>${product.discount ? `<del>Rs ${Number(product.price).toFixed(2)}</del> Rs ${finalPrice.toFixed(2)} · ${escapeHtml(product.discount)}% off` : `Rs ${Number(product.price).toFixed(2)}`}</p></div></article>`;
		}).join('') : '<p class="shop-results-status">No products available.</p>';
		shopProductsList.querySelectorAll('[data-product]').forEach(card => {
			const product = JSON.parse(card.dataset.product);
			const addButton = card.querySelector('[data-add-cart]');
			addButton.addEventListener('click', event => { event.stopPropagation(); addToCart(product); addButton.classList.toggle('added', cartItems.some(item => String(item.id) === String(product.id))); });
			const openDetails = () => openProductDetails(product);
			card.addEventListener('click', openDetails);
			card.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openDetails(); } });
		});
	} catch (error) {
		shopProductsList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

const renderPublicReviews = reviews => {
	if (!productReviewsList) return;
	if (!reviews.length) {
		productReviewSummary.textContent = '';
		productReviewsList.innerHTML = '<p class="shop-results-status">No reviews yet.</p>';
		return;
	}
	const average = reviews.reduce((sum, review) => sum + Number(review.rating), 0) / reviews.length;
	productReviewSummary.textContent = `${average.toFixed(1)} / 5 · ${reviews.length} review${reviews.length === 1 ? '' : 's'}`;
	productReviewsList.innerHTML = reviews.map(review => {
		const canDelete = profileData.role === 'customer' && String(profileData.id || localStorage.getItem('userId')) === String(review.customerId);
		return `<article class="public-review"><div class="public-review-top"><div class="review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}<span>${'★'.repeat(5 - review.rating)}</span></div>${canDelete ? `<button class="public-review-delete" type="button" data-delete-review="${escapeHtml(review.id)}" aria-label="Delete your review" title="Delete your review">&times;</button>` : ''}</div><strong>${escapeHtml(review.customerName)}</strong><p>${escapeHtml(review.comment)}</p></article>`;
	}).join('');
	productReviewsList.querySelectorAll('[data-delete-review]').forEach(button => button.addEventListener('click', async () => {
		button.disabled = true;
		try {
			const response = await fetch(`/api/reviews/${encodeURIComponent(button.dataset.deleteReview)}?customerId=${encodeURIComponent(localStorage.getItem('userId') || profileData.id)}`, { method: 'DELETE' });
			const result = await readJsonResponse(response);
			if (!response.ok) throw new Error(result.error || 'Unable to delete your review.');
			loadProductReviews(selectedProductForPayment.id);
		} catch (error) {
			button.disabled = false;
			button.title = error.message;
		}
	}));
};

const loadProductReviews = async productId => {
	if (!productReviewsList) return;
	productReviewSummary.textContent = '';
	productReviewsList.innerHTML = '<p class="shop-results-status">Loading reviews...</p>';
	try {
		const response = await fetch(`/api/products/${encodeURIComponent(productId)}/reviews`);
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to load reviews.');
		renderPublicReviews(result.reviews || []);
	} catch (error) {
		productReviewsList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

const openProductDetails = product => {
	selectedProductForPayment = product;
	const finalPrice = Number(product.price) * (1 - Number(product.discount) / 100);
	productDetailTitle.textContent = product.name;
	productDetailStore.textContent = product.storeName ? `From ${product.storeName}` : '';
	productDetailImage.src = product.photo;
	productDetailImage.alt = product.name;
	productDetailPrice.innerHTML = product.discount ? `<del>Rs ${Number(product.price).toFixed(2)}</del> Rs ${finalPrice.toFixed(2)}` : `Rs ${Number(product.price).toFixed(2)}`;
	productDetailDiscount.textContent = product.discount ? `${product.discount}% discount` : 'No discount available';
	productDetailDescription.textContent = product.description || 'No additional information provided.';
	loadProductReviews(product.id);
	productDetailQrImage.src = product.upiQr || '';
	productDetailQr.hidden = !product.upiQr;
	if (product.upiId) {
		fetch('/api/payments/upi/qr', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ upiId: product.upiId, name: product.storeName, amount: finalPrice }) })
			.then(readJsonResponse)
			.then(result => { productDetailQrImage.src = result.qr; productDetailQr.hidden = false; paymentMessage.textContent = `Scan to pay Rs ${finalPrice.toFixed(2)} directly to the vendor.`; })
			.catch(() => {});
	}
	paymentMessage.textContent = product.upiQr ? 'Scan the QR code above to pay the vendor directly.' : 'The vendor has not uploaded a QR code yet.';
	payWithRazorpay.disabled = false;
	productDetailModal.classList.add('open');
};

payWithRazorpay?.addEventListener('click', async () => {
	if (!selectedProductForPayment) return;
	await openCheckoutForItems([selectedProductForPayment], 'Razorpay');
	return;
	paymentMessage.textContent = 'Preparing secure Razorpay checkout...';
	payWithRazorpay.disabled = true;
	try {
		const response = await fetch('/api/payments/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ amount: Number(selectedProductForPayment.price) * (1 - Number(selectedProductForPayment.discount) / 100), productId: selectedProductForPayment.id }) });
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to start Razorpay checkout.');
		if (!window.Razorpay) throw new Error('Razorpay checkout script is unavailable.');
		new window.Razorpay({ key: result.keyId, amount: result.order.amount, currency: result.order.currency, name: 'gKart', description: selectedProductForPayment.name, order_id: result.order.id, handler: async payment => {
			const verifyResponse = await fetch('/api/payments/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payment, order: { customerId: localStorage.getItem('userId'), productId: selectedProductForPayment.id } }) });
			const verifyResult = await readJsonResponse(verifyResponse);
			paymentMessage.textContent = verifyResponse.ok ? verifyResult.message : verifyResult.error;
			if (verifyResponse.ok) {
				loadOrderHistory(localStorage.getItem('userId'));
				showPaymentSuccess('Payment successful.', 'Your order has been added to your order history.', selectedProductForPayment);
			}
		} }).open();
	} catch (error) {
		paymentMessage.textContent = error.message;
	} finally {
		payWithRazorpay.disabled = false;
	}
});

markQrPaid?.addEventListener('click', async () => {
	if (!selectedProductForPayment) return;
	await openCheckoutForItems([selectedProductForPayment], 'QR code');
});

productCod?.addEventListener('click', async () => {
	if (!selectedProductForPayment) return;
	await openCheckoutForItems([selectedProductForPayment], 'Cash on delivery');
	return;
	const customerId = localStorage.getItem('userId');
	if (profileData.role !== 'customer' || !customerId) {
		paymentMessage.textContent = 'Please sign in as a customer before ordering.';
		return;
	}
	productCod.disabled = true;
	try {
		const response = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerId, productId: selectedProductForPayment.id, paymentMethod: 'cash on delivery', status: 'pending' }) });
		const result = await readJsonResponse(response);
		if (!response.ok) throw new Error(result.error || 'Unable to place the order.');
		paymentMessage.textContent = 'Order confirmed and added to your order history.';
		showPaymentSuccess('Order confirmed.', 'Your cash-on-delivery order has been added to your order history.');
		loadOrderHistory(customerId);
	} catch (error) {
		paymentMessage.textContent = error.message;
	} finally {
		productCod.disabled = false;
	}
});

document.getElementById('closeProductDetail')?.addEventListener('click', () => productDetailModal.classList.remove('open'));
productDetailModal?.addEventListener('click', event => { if (event.target === productDetailModal) productDetailModal.classList.remove('open'); });
productDetailQrImage?.addEventListener('click', () => { qrViewerImage.src = productDetailQrImage.src; qrViewer.classList.add('open'); });
document.getElementById('closeQrViewer')?.addEventListener('click', () => qrViewer.classList.remove('open'));
qrViewer?.addEventListener('click', event => { if (event.target === qrViewer) qrViewer.classList.remove('open'); });

const loadAvailableShops = async () => {
	if (!availableShops && !allStoresList) return;
	try {
		const response = await fetch('/api/shops/search?q=');
		const data = await readJsonResponse(response);
		if (!response.ok) throw new Error(data.error || 'Unable to load local shops.');
		const cards = renderShopCards(data.shops || [], 'No shops have registered yet.');
		if (availableShops) availableShops.innerHTML = cards;
		if (allStoresList) allStoresList.innerHTML = cards;
	} catch (error) {
		const message = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
		if (availableShops) availableShops.innerHTML = message;
		if (allStoresList) allStoresList.innerHTML = message;
	}
};

const loadNearbyShops = async () => {
	if (!nearbyShopsList) return;
	const city = String(profileData.city || '').trim();
	if (!city) {
		nearbyLocationNote.textContent = 'Add your city to your profile to discover nearby shops.';
		nearbyShopsList.innerHTML = '<p class="shop-results-status">Your city is not set yet. Open Your profile and add it to see local shops.</p>';
		return;
	}
	nearbyLocationNote.textContent = `Registered shops in ${city}`;
	nearbyShopsList.innerHTML = '<p class="shop-results-status">Finding shops near you...</p>';
	try {
		const response = await fetch(`/api/shops/search?q=&city=${encodeURIComponent(city)}`);
		const data = await readJsonResponse(response);
		if (!response.ok) throw new Error(data.error || 'Unable to load nearby shops.');
		nearbyShopsList.innerHTML = renderNearbyShops(data.shops || [], `No shops have registered in ${city} yet.`);
	} catch (error) {
		nearbyShopsList.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

const openStoreFromClick = event => {
	if (event.target.closest('[data-map-link]')) return;
	const card = event.target.closest('[data-vendor-id]');
	if (card) showVendorProducts(card.dataset.vendorId);
};

availableShops?.addEventListener('click', openStoreFromClick);
allStoresList?.addEventListener('click', openStoreFromClick);
nearbyShopsList?.addEventListener('click', openStoreFromClick);
shopResults?.addEventListener('click', event => {
		const productCard = event.target.closest('[data-product]');
		if (productCard) openProductDetails(JSON.parse(productCard.dataset.product));
});
shopResults?.addEventListener('keydown', event => {
	if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('[data-product]')) {
		event.preventDefault();
		openProductDetails(JSON.parse(event.target.closest('[data-product]').dataset.product));
	}
});
nearbyShopsList?.addEventListener('keydown', event => {
	if ((event.key === 'Enter' || event.key === ' ') && event.target.closest('[data-vendor-id]')) {
		event.preventDefault();
		showVendorProducts(event.target.closest('[data-vendor-id]').dataset.vendorId);
	}
});

document.getElementById('closeShopProducts')?.addEventListener('click', () => shopProductsModal.classList.remove('open'));
shopProductsModal?.addEventListener('click', event => { if (event.target === shopProductsModal) shopProductsModal.classList.remove('open'); });

const searchVendors = async () => {
	if (!customerStoreSearch || !shopResults) return;
	const searchQuery = customerStoreSearch.value.trim();
	shopResults.innerHTML = '<p class="shop-results-status">Searching stores and products...</p>';
	try {
		const response = await fetch(`/api/shops/search?q=${encodeURIComponent(searchQuery)}`);
		const data = await readJsonResponse(response);
		if (!response.ok) throw new Error(data.error || 'Unable to search shops.');
		const shops = data.shops || [];
		shopResults.innerHTML = renderSearchResults(shops, 'No local shops or products found.');
	} catch (error) {
		shopResults.innerHTML = `<p class="shop-results-status">${escapeHtml(error.message)}</p>`;
	}
};

customerStoreSearch?.addEventListener('input', searchVendors);
loadAvailableShops();

const playPageTransition = () => {
	pageTransition.classList.remove('active');
	void pageTransition.offsetWidth;
	pageTransition.classList.add('active');
};

const showCustomerPage = targetId => {
	const homeSection = document.querySelector('.customer-home-content');
	const targetPage = document.getElementById(targetId);
	if (!targetPage || !homeSection) return;
	history.replaceState(null, '', `#${targetId}`);
	playPageTransition();
	const isOffersPage = targetId === 'customerOffersPage';
	const isStoresPage = targetId === 'customerStoresPage';
	const isPreferencePage = targetId === 'customerPreferencePage';
	const isNearbyPage = targetId === 'customerNearbyPage';
	const isCartPage = targetId === 'customerCart';
	const isReportPage = targetId === 'customerReport';
	const isHomeView = targetId === 'customerHome';
	homeSection.style.display = (isOffersPage || isStoresPage || isPreferencePage || isNearbyPage || isCartPage || isReportPage) ? 'none' : 'grid';
	if (customerStoresPage) customerStoresPage.classList.toggle('active', isStoresPage);
	if (customerPreferencePage) customerPreferencePage.classList.toggle('active', isPreferencePage);
	if (customerOffersPage) customerOffersPage.classList.toggle('active', isOffersPage);
	if (customerNearbyPage) customerNearbyPage.classList.toggle('active', isNearbyPage);
	if (isNearbyPage) loadNearbyShops();
	if (customerCartPage) customerCartPage.classList.toggle('active', isCartPage);
	if (customerReportPage) customerReportPage.classList.toggle('active', isReportPage);
	if (targetId === 'customerReport' && customerChatbotMessages && customerChatbotChoices && customerCommentForm && customerBugForm && customerCustomerForm) {
		customerCommentForm.classList.remove('visible');
		customerCommentForm.reset();
		customerBugForm.classList.remove('visible');
		customerBugForm.reset();
		customerCustomerForm.classList.remove('visible');
		customerCustomerForm.reset();
		customerChatbotShell.appendChild(customerCommentForm);
		customerChatbotShell.appendChild(customerBugForm);
		customerChatbotShell.appendChild(customerCustomerForm);
		customerChatbotMessages.innerHTML = '';
		customerChatbotChoices.classList.remove('visible');
		customerQuestionButtons.forEach(button => { button.hidden = false; });
		const typingMessage = document.createElement('div');
		typingMessage.className = 'chat-message bot';
		typingMessage.innerHTML = '<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><span class="typing-dots" aria-label="Chatbot is typing"><i></i><i></i><i></i></span></div>';
		customerChatbotMessages.appendChild(typingMessage);
		customerChatbotMessages.scrollTop = customerChatbotMessages.scrollHeight;
		setTimeout(() => {
			typingMessage.innerHTML = '<span class="chat-avatar">g.</span><div><small class="mono">gKart support</small><p>Hi sir, how can I help you?</p></div>';
			customerChatbotMessages.scrollTop = customerChatbotMessages.scrollHeight;
			customerChatbotChoices.classList.add('visible');
		}, 2000);
	}
	const links = document.querySelectorAll('.customer-nav-links a');
	links.forEach(link => {
		const href = link.getAttribute('href');
		link.classList.toggle('active', href === `#${targetId}` || (isHomeView && href === '#customerHome'));
	});
	setTimeout(() => {
		targetPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, 430);
};

renderCustomerOffers();

pageTransition.addEventListener('animationend', () => {
	pageTransition.classList.remove('active', 'dashboard-transition');
});

const customerNavLinks = document.querySelectorAll('.customer-nav-links a, .customer-box-link');
customerNavLinks.forEach(link => {
	const hash = link.getAttribute('href');
	if (!hash || !['#customerHome', '#customerStoresPage', '#customerPreferencePage', '#customerNearbyPage', '#customerOffersPage', '#customerCart', '#customerReport'].includes(hash)) return;
	link.addEventListener('click', event => {
		event.preventDefault();
		showCustomerPage(hash.replace('#', ''));
	});
});

const logoutUser = () => {
	if (!window.confirm('Are you sure you want to log out?')) return;
	localStorage.removeItem('gkart-profile');
	localStorage.removeItem('userId');
	localStorage.removeItem('gkart-cart');
	profileData = { id: '', name: 'Your name', phone: '', email: '', city: '', vendorAddress: '', image: '', password: '', role: '', upiId: '' };
	cartItems = [];
	selectedRole = 'customer';
	accountModal.classList.remove('open');
	document.querySelectorAll('.modal-backdrop, .payment-success, .confirm-payment-dialog, .qr-viewer').forEach(modal => modal.classList.remove('open'));
	guestView.classList.remove('active', 'vendor-view');
	document.body.classList.remove('guest-mode', 'vendor-mode');
	landingHeader.style.display = '';
	document.querySelector('main').style.display = '';
	window.scrollTo(0, 0);
};

customerLogout?.addEventListener('click', logoutUser);
vendorLogout?.addEventListener('click', logoutUser);

customerAccountToggle?.addEventListener('click', () => {
	const isOpen = customerAccountOptions.classList.toggle('open');
	customerAccountToggle.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', event => {
	if (!event.target.closest('.customer-account-menu')) {
		customerAccountOptions?.classList.remove('open');
		customerAccountToggle?.setAttribute('aria-expanded', 'false');
	}
	if (!event.target.closest('.vendor-account-menu')) {
		vendorAccountOptions?.classList.remove('open');
		vendorAccountToggle?.setAttribute('aria-expanded', 'false');
	}
});

vendorAccountToggle?.addEventListener('click', () => {
	const isOpen = vendorAccountOptions.classList.toggle('open');
	vendorAccountToggle.setAttribute('aria-expanded', String(isOpen));
});

const setLoginMode = isLogin => {
	accountForm.classList.toggle('login-mode', isLogin);
	formRole.textContent = isLogin ? 'Sign in' : (vendorAddressField.classList.contains('visible') ? 'Vendor account' : 'Customer account');
	formTitle.textContent = isLogin ? 'Welcome back.' : (vendorAddressField.classList.contains('visible') ? 'Bring your work here.' : 'Welcome to your local.');
	passwordLabel.textContent = isLogin ? 'Your password' : 'Set a password';
	accountForm.querySelector('#phone').closest('.field').classList.toggle('registration-only', isLogin);
	accountForm.querySelector('#city').closest('.field').classList.toggle('registration-only', isLogin);
	accountForm.querySelector('#vendorAddressField').classList.toggle('registration-only', isLogin);
	accountForm.querySelector('.photo-field').classList.toggle('registration-only', isLogin);
	accountForm.querySelector('#upiQrField').classList.toggle('registration-only', isLogin || selectedRole !== 'vendor');
	accountForm.querySelector('#fullName').closest('.field').classList.toggle('registration-only', isLogin);
	accountForm.querySelector('#fullName').required = !isLogin;
	accountForm.querySelector('#phone').required = !isLogin;
	accountForm.querySelector('#city').required = !isLogin;
	accountForm.querySelector('#vendorAddress').required = !isLogin && vendorAddressField.classList.contains('visible');
	accountForm.querySelector('#photo').required = !isLogin;
	accountForm.querySelector('#upiQr').required = !isLogin && selectedRole === 'vendor';
	accountForm.querySelector('.submit-form').innerHTML = isLogin ? 'Sign in <span>↗</span>' : 'Create my account <span>↗</span>';
	accountSwitch.textContent = isLogin ? 'Need an account? Create one' : 'Already have an account?';
	formMessage.classList.remove('show');
};

document.querySelectorAll('.choice').forEach(choice => choice.addEventListener('click', () => {
	const isVendor = choice.dataset.role === 'vendor';
	selectedRole = isVendor ? 'vendor' : 'customer';
	formRole.textContent = isVendor ? 'Vendor account' : 'Customer account';
	formTitle.textContent = isVendor ? 'Bring your work here.' : 'Welcome to your local.';
	vendorAddressField.classList.toggle('visible', isVendor);
	document.getElementById('upiQrField').classList.toggle('visible', isVendor);
	vendorAddress.required = isVendor;
	guestEntry.classList.add('visible');
	formMessage.classList.remove('show');
	accountModal.classList.add('open');
	setLoginMode(false);
	document.getElementById('fullName').focus();
}));

const closeAccountModal = () => accountModal.classList.remove('open');

const enterHome = (showCustomerVideo = selectedRole === 'customer') => {
	closeAccountModal();
	showHomeView(selectedRole === 'vendor', showCustomerVideo);
	window.scrollTo(0, 0);
	playPageTransition();
};

document.getElementById('closeModal').addEventListener('click', closeAccountModal);
guestEntry.addEventListener('click', () => {
	enterHome(selectedRole === 'customer');
});

photoInput.addEventListener('change', () => {
	photoName.textContent = photoInput.files[0]?.name || 'No photo selected';
});
upiQrInput?.addEventListener('change', () => {
	upiQrName.textContent = upiQrInput.files[0]?.name || 'Fampay, GPay, PhonePe, and other UPI apps';
});
accountSwitch.addEventListener('click', () => setLoginMode(!accountForm.classList.contains('login-mode')));
accountModal.addEventListener('click', event => { if (event.target === accountModal) closeAccountModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeAccountModal(); });
	accountForm.addEventListener('submit', async event => {
		event.preventDefault();
		const isLogin = accountForm.classList.contains('login-mode');
		const submitButton = event.target.querySelector('.submit-form');
		const sendAccount = async (image, upiQr) => {
			formMessage.textContent = '';
			formMessage.classList.remove('show');
			submitButton.disabled = true;
			try {
				const response = await fetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						fullName: accountForm.fullName.value.trim(),
						phone: accountForm.phone.value.trim(),
						email: accountForm.email.value.trim(),
						city: accountForm.city.value.trim(),
						password: accountForm.password.value,
						role: selectedRole,
						vendorAddress: accountForm.vendorAddress.value.trim(),
						photo: image,
						upiQr,
					})
				});
				const result = await readJsonResponse(response);
				if (!response.ok) throw new Error(result.error || 'Unable to save your account.');
				const account = result.account;
				selectedRole = account.role;
					profileData = { id: account.id, name: account.fullName, phone: account.phone, email: account.email, city: account.city, vendorAddress: account.vendorAddress, upiQr: account.upiQr, upiId: account.upiId, image: account.photo, password: '', role: account.role };
				localStorage.setItem('gkart-profile', JSON.stringify(profileData));
				localStorage.setItem('userId', String(account.id));
					if (account.role === 'vendor') { loadVendorProducts(account.id); loadVendorReviews(account.id); loadVendorOrders(account.id); }
					if (account.role === 'customer') loadOrderHistory(account.id);
				renderProfile();
				formMessage.textContent = isLogin ? 'You are signed in.' : 'Account details received. Your space is being prepared.';
				formMessage.classList.add('show');
				submitButton.textContent = isLogin ? 'Signed in' : 'Account created';
				setTimeout(() => enterHome(account.role === 'customer'), 350);
			} catch (error) {
				formMessage.textContent = error.message;
				formMessage.classList.add('show');
			} finally {
				submitButton.disabled = false;
			}
		};
		const readFile = file => new Promise(resolve => {
			if (!file) { resolve(''); return; }
			const reader = new FileReader();
			reader.addEventListener('load', () => resolve(reader.result));
			reader.readAsDataURL(file);
		});
		Promise.all([readFile(isLogin ? null : photoInput.files[0]), readFile(isLogin ? null : upiQrInput.files[0])])
			.then(([image, upiQr]) => sendAccount(image, upiQr));
	});

if (profileData.role === 'customer' && profileData.id) loadOrderHistory(profileData.id);
if (profileData.role === 'vendor' && profileData.id) loadVendorReviews(profileData.id);
if (profileData.role === 'vendor' && profileData.id) loadVendorOrders(profileData.id);
setInterval(() => {
	if (profileData.role === 'customer' && profileData.id) loadOrderHistory(profileData.id);
	if (profileData.role === 'vendor' && profileData.id) loadVendorOrders(profileData.id);
}, 10000);

const restoreSessionView = () => {
	if (!profileData.id || !['customer', 'vendor'].includes(profileData.role)) return;
	showHomeView(profileData.role === 'vendor');
	const hash = window.location.hash;
	if (profileData.role === 'customer') {
		const customerPage = hash.replace('#', '');
		const customerPages = ['customerHome', 'customerStoresPage', 'customerPreferencePage', 'customerNearbyPage', 'customerOffersPage', 'customerCart', 'customerReport'];
		showCustomerPage(customerPages.includes(customerPage) ? customerPage : 'customerHome');
		return;
	}
	const vendorLink = document.querySelector(`.static-nav-links a[href="${hash}"]`);
	if (vendorLink && vendorLink !== homeLink) vendorLink.click();
};

restoreSessionView();
