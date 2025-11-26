// ============================================
// CHECKOUT SCRIPT - COMANDAYA
// Sistema de pagos con Recurrente
// ============================================

// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
// 🔥 IMPORTANTE: Reemplaza estos valores con tu configuración real
// Obtén tus credenciales desde Firebase Console:
// https://console.firebase.google.com/project/orderapp-e0c31/settings/general
const firebaseConfig = {
  apiKey: "AIzaSyD0if0ACDfngNzhthGAW_NHcHOikqvIXdo",
  authDomain: "orderapp-e0c31.firebaseapp.com",
  projectId: "orderapp-e0c31",
  storageBucket: "orderapp-e0c31.appspot.com",
  messagingSenderId: "510382881068",
  appId: "1:510382881068:web:399ffec02b4e44e3629489",
  measurementId: "G-PL4WJZ40QP"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// ============================================
// ESTADO GLOBAL
// ============================================
const state = {
  currentStep: 1,
  user: null,
  restaurantId: null,
  selectedPlan: null,
  selectedCycle: 'annual',
  plans: {
    basico: {
      id: 'basico',
      name: 'Básico',
      monthlyPrice: 175,
      annualPrice: 99,
      annualTotal: 1188
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      monthlyPrice: 275,
      annualPrice: 199,
      annualTotal: 2388
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      monthlyPrice: 425,
      annualPrice: 350,
      annualTotal: 4200
    }
  }
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Checkout iniciado');
  
  // Verificar si viene de la app con parámetros
  const urlParams = new URLSearchParams(window.location.search);
  const planFromUrl = urlParams.get('plan');
  const cycleFromUrl = urlParams.get('cycle');
  
  if (planFromUrl && state.plans[planFromUrl]) {
    state.selectedPlan = planFromUrl;
    if (cycleFromUrl === 'monthly' || cycleFromUrl === 'annual') {
      state.selectedCycle = cycleFromUrl;
    }
  }
  
  // Verificar estado de autenticación
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log('✅ Usuario autenticado:', user.email);
      state.user = user;
      findRestaurantId(user.uid);
    } else {
      console.log('❌ Usuario no autenticado');
      showStep(1);
    }
  });
  
  initializeEventListeners();
});

// ============================================
// BUSCAR RESTAURANTE DEL USUARIO
// ============================================
async function findRestaurantId(userId) {
  try {
    console.log('🔍 Buscando restaurante para userId:', userId);
    
    // Buscar en la colección restaurants donde el campo userId coincida
    const snapshot = await db.collection('restaurants')
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (!snapshot.empty) {
      state.restaurantId = snapshot.docs[0].id;
      console.log('✅ Restaurante encontrado:', state.restaurantId);
      
      // Si ya tiene un plan seleccionado desde la URL, ir directo al paso 2
      if (state.selectedPlan) {
        showStep(2);
        // Pre-seleccionar el plan y ciclo
        setTimeout(() => {
          selectBillingCycle(state.selectedCycle);
          selectPlan(state.selectedPlan);
        }, 100);
      } else {
        showStep(2);
      }
    } else {
      console.error('❌ No se encontró restaurante para este usuario');
      showError('No se encontró tu restaurante. Por favor contacta a soporte.');
      showStep(1);
    }
  } catch (error) {
    console.error('❌ Error buscando restaurante:', error);
    showError('Error al cargar tu información. Intenta nuevamente.');
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
  // AUTH - Toggle between login/register
  document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('email-auth').classList.add('hidden');
    document.getElementById('register-auth').classList.remove('hidden');
  });
  
  document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-auth').classList.add('hidden');
    document.getElementById('email-auth').classList.remove('hidden');
  });
  
  // AUTH - Login form
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  
  // AUTH - Register form
  document.getElementById('register-form')?.addEventListener('submit', handleRegister);
  
  // BILLING - Toggle annual/monthly
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cycle = btn.dataset.cycle;
      selectBillingCycle(cycle);
    });
  });
  
  // PLANS - Select plan buttons
  document.querySelectorAll('.btn-select-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      const planId = btn.dataset.plan;
      selectPlan(planId);
    });
  });
  
  // CONFIRMATION - Back to plans
  document.getElementById('back-to-plans')?.addEventListener('click', () => {
    showStep(2);
  });
  
  // CONFIRMATION - Proceed to payment
  document.getElementById('proceed-payment')?.addEventListener('click', handleProceedToPayment);
}

// ============================================
// STEP 1: AUTENTICACIÓN
// ============================================
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loadingOverlay = document.getElementById('auth-loading');
  
  try {
    loadingOverlay.classList.remove('hidden');
    
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log('✅ Login exitoso:', userCredential.user.email);
    
    // El onAuthStateChanged se encargará del resto
  } catch (error) {
    console.error('❌ Error en login:', error);
    loadingOverlay.classList.add('hidden');
    
    let errorMessage = 'Error al iniciar sesión';
    if (error.code === 'auth/wrong-password') {
      errorMessage = 'Contraseña incorrecta';
    } else if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuario no encontrado';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    }
    
    showError(errorMessage);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const loadingOverlay = document.getElementById('auth-loading');
  
  try {
    loadingOverlay.classList.remove('hidden');
    
    // Crear usuario en Firebase Auth
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    
    console.log('✅ Usuario creado:', userId);
    
    // Crear documento de restaurante en Firestore
    const restaurantRef = await db.collection('restaurants').add({
      name: name,
      email: email,
      userId: userId,
      phone: '',
      address: '',
      image: '',
      premium: false,
      plan: '',
      status: true,
      moneySymbol: 'Q',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      inTrial: false,
      usedTrial: false,
      trialStartDate: 0,
      trialEndDate: 0,
      subscriptionId: '',
      recurrenteCustomerId: '',
      subscriptionStatus: '',
      billingCycle: '',
      subscriptionStartDate: 0
    });
    
    state.restaurantId = restaurantRef.id;
    console.log('✅ Restaurante creado:', state.restaurantId);
    
    // El onAuthStateChanged se encargará del resto
  } catch (error) {
    console.error('❌ Error en registro:', error);
    loadingOverlay.classList.add('hidden');
    
    let errorMessage = 'Error al crear cuenta';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Este email ya está registrado';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'La contraseña debe tener al menos 6 caracteres';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Email inválido';
    }
    
    showError(errorMessage);
  }
}

// ============================================
// STEP 2: SELECCIÓN DE PLAN
// ============================================
function selectBillingCycle(cycle) {
  state.selectedCycle = cycle;
  
  // Actualizar UI del toggle
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    if (btn.dataset.cycle === cycle) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Mostrar/ocultar precios
  document.querySelectorAll('.plan-card').forEach(card => {
    const annualPrices = card.querySelectorAll('.annual');
    const monthlyPrices = card.querySelectorAll('.monthly');
    
    if (cycle === 'annual') {
      annualPrices.forEach(el => el.classList.remove('hidden'));
      monthlyPrices.forEach(el => el.classList.add('hidden'));
    } else {
      annualPrices.forEach(el => el.classList.add('hidden'));
      monthlyPrices.forEach(el => el.classList.remove('hidden'));
    }
  });
  
  console.log('💰 Ciclo seleccionado:', cycle);
}

function selectPlan(planId) {
  if (!state.plans[planId]) {
    console.error('❌ Plan no válido:', planId);
    return;
  }
  
  state.selectedPlan = planId;
  console.log('📦 Plan seleccionado:', planId);
  
  // Actualizar UI de confirmación
  updateConfirmation();
  
  // Ir al paso 3
  showStep(3);
}

// ============================================
// STEP 3: CONFIRMACIÓN
// ============================================
function updateConfirmation() {
  const plan = state.plans[state.selectedPlan];
  const cycle = state.selectedCycle;
  
  document.getElementById('summary-plan-name').textContent = `Plan ${plan.name}`;
  document.getElementById('summary-billing-cycle').textContent = 
    cycle === 'annual' ? 'Anual' : 'Mensual';
  
  const price = cycle === 'annual' ? plan.annualTotal : plan.monthlyPrice;
  const priceText = cycle === 'annual' 
    ? `Q${plan.annualTotal} (Q${plan.annualPrice}/mes)`
    : `Q${plan.monthlyPrice}/mes`;
  
  document.getElementById('summary-total').textContent = priceText;
  document.getElementById('summary-email').textContent = state.user?.email || '';
}

async function handleProceedToPayment() {
  if (!state.restaurantId || !state.selectedPlan) {
    showError('Información incompleta. Por favor recarga la página.');
    return;
  }
  
  const loadingOverlay = document.getElementById('payment-loading');
  
  try {
    loadingOverlay.classList.remove('hidden');
    
    console.log('🚀 Creando sesión de checkout...');
    console.log('📝 Datos:', {
      restaurantId: state.restaurantId,
      planId: state.selectedPlan,
      billingCycle: state.selectedCycle
    });
    
    // Llamar a la Cloud Function
    const createCheckoutSession = functions.httpsCallable('createCheckoutSession');
    const result = await createCheckoutSession({
      restaurantId: state.restaurantId,
      planId: state.selectedPlan,
      billingCycle: state.selectedCycle,
      successUrl: 'https://comandaya.com/checkout/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'https://comandaya.com/checkout/?cancelled=true'
    });
    
    console.log('✅ Sesión creada:', result.data);
    
    if (result.data.success && result.data.checkoutUrl) {
      console.log('🔗 Redirigiendo a Recurrente...');
      window.location.href = result.data.checkoutUrl;
    } else {
      throw new Error('No se obtuvo URL de checkout');
    }
  } catch (error) {
    console.error('❌ Error creando checkout:', error);
    loadingOverlay.classList.add('hidden');
    
    let errorMessage = 'Error al procesar el pago. Por favor intenta nuevamente.';
    if (error.message) {
      errorMessage += ' (' + error.message + ')';
    }
    
    showError(errorMessage);
  }
}

// ============================================
// NAVEGACIÓN ENTRE STEPS
// ============================================
function showStep(stepNumber) {
  state.currentStep = stepNumber;
  
  // Ocultar todos los steps
  document.querySelectorAll('.checkout-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Mostrar el step actual
  document.getElementById(`step-${stepNumber}`).classList.add('active');
  
  // Actualizar indicadores de progreso
  document.querySelectorAll('.step').forEach((indicator, index) => {
    const stepNum = index + 1;
    if (stepNum <= stepNumber) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log('📍 Step actual:', stepNumber);
}

// ============================================
// UTILIDADES
// ============================================
function showError(message) {
  // Crear elemento de error si no existe
  let errorDiv = document.getElementById('global-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.id = 'global-error';
    errorDiv.style.cssText = `
      position: fixed;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: #ff4444;
      color: white;
      padding: 16px 24px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      font-weight: 600;
      max-width: 90%;
      text-align: center;
    `;
    document.body.appendChild(errorDiv);
  }
  
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  
  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 5000);
}

// ============================================
// LOG DE INICIO
// ============================================
console.log('✅ Checkout script cargado');
console.log('🔧 Configuración:', {
  projectId: firebaseConfig.projectId,
  domain: window.location.hostname
});