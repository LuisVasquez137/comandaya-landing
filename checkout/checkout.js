// ============================================
// CHECKOUT SCRIPT - COMANDAYA
// Versión optimizada para GITHUB PAGES
// Con sistema de debugging extensivo
// ============================================

// ============================================
// MODO DEBUG - ACTIVAR DURANTE DESARROLLO
// ============================================
const DEBUG_MODE = true; // ← Cambiar a false en producción

function debugLog(message, data = null) {
  console.log(`[DEBUG] ${message}`, data || '');
  
  if (DEBUG_MODE) {
    // Panel de debug visual
    let debugPanel = document.getElementById('debug-panel');
    if (!debugPanel) {
      debugPanel = document.createElement('div');
      debugPanel.id = 'debug-panel';
      debugPanel.style.cssText = `
        position: fixed;
        top: 70px;
        right: 10px;
        background: rgba(0,0,0,0.95);
        color: #00ff00;
        padding: 15px;
        padding-top: 35px;
        border-radius: 8px;
        max-width: 450px;
        max-height: 600px;
        overflow-y: auto;
        font-family: 'Courier New', monospace;
        font-size: 11px;
        z-index: 10000;
        border: 2px solid #00ff00;
        box-shadow: 0 0 20px rgba(0,255,0,0.3);
      `;
      
      // Título del panel
      const title = document.createElement('div');
      title.textContent = '🐛 DEBUG PANEL';
      title.style.cssText = `
        position: absolute;
        top: 8px;
        left: 15px;
        font-weight: bold;
        color: #00ff00;
        font-size: 14px;
      `;
      debugPanel.appendChild(title);
      
      // Botón para cerrar
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕';
      closeBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 5px;
        background: #ff0000;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        cursor: pointer;
        border-radius: 4px;
        font-weight: bold;
      `;
      closeBtn.onclick = () => debugPanel.style.display = 'none';
      debugPanel.appendChild(closeBtn);
      
      // Botón para limpiar
      const clearBtn = document.createElement('button');
      clearBtn.textContent = '🗑️';
      clearBtn.style.cssText = `
        position: absolute;
        top: 5px;
        right: 35px;
        background: #FFA500;
        color: white;
        border: none;
        width: 25px;
        height: 25px;
        cursor: pointer;
        border-radius: 4px;
      `;
      clearBtn.onclick = () => {
        const logs = debugPanel.querySelectorAll('.log-entry');
        logs.forEach(log => log.remove());
      };
      debugPanel.appendChild(clearBtn);
      
      document.body.appendChild(debugPanel);
    }
    
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.style.cssText = 'margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;';
    
    let logHTML = `<strong style="color: #FFD700;">[${timestamp}]</strong> ${message}`;
    
    if (data !== null) {
      if (typeof data === 'object') {
        logHTML += `<br><pre style="margin: 5px 0; color: #88ff88; font-size: 10px; white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>`;
      } else {
        logHTML += `<br><span style="color: #88ff88;">${data}</span>`;
      }
    }
    
    logEntry.innerHTML = logHTML;
    debugPanel.appendChild(logEntry);
    debugPanel.scrollTop = debugPanel.scrollHeight;
  }
}

// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyD0if0ACDfngNzhthGAW_NHcHOikqvIXdo",
  authDomain: "orderapp-e0c31.firebaseapp.com",
  projectId: "orderapp-e0c31",
  storageBucket: "orderapp-e0c31.appspot.com",
  messagingSenderId: "510382881068",
  appId: "1:510382881068:web:399ffec02b4e44e3629489",
  measurementId: "G-PL4WJZ40QP"
};

debugLog('🔥 Inicializando Firebase...', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain
});

try {
  firebase.initializeApp(firebaseConfig);
  debugLog('✅ Firebase inicializado correctamente');
} catch (error) {
  debugLog('❌ ERROR inicializando Firebase', {
    message: error.message,
    code: error.code
  });
  alert('Error al conectar con Firebase. Recarga la página.');
}

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// ============================================
// VERIFICAR CONECTIVIDAD CON FIRESTORE
// ============================================
debugLog('🌐 Verificando conectividad con Firestore desde GitHub Pages...');
db.collection('test').limit(1).get()
  .then(() => {
    debugLog('✅ Firestore: Conexión exitosa desde ' + window.location.hostname);
  })
  .catch(error => {
    debugLog('❌ Firestore: Error de conexión', {
      code: error.code,
      message: error.message,
      hint: error.code === 'permission-denied' 
        ? 'Verifica las reglas de Firestore'
        : 'Posible problema de CORS o configuración'
    });
  });

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
  debugLog('🚀 DOM Cargado - Iniciando checkout');
  debugLog('📍 URL', window.location.href);
  debugLog('🌍 Hostname', window.location.hostname);
  debugLog('🔒 Protocolo', window.location.protocol);
  
  // Verificar parámetros URL
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const planFromUrl = urlParams.get('plan');
  const cycleFromUrl = urlParams.get('cycle');
  
  debugLog('📋 Parámetros URL', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    plan: planFromUrl || 'no especificado',
    cycle: cycleFromUrl || 'no especificado'
  });
  
  // Guardar plan y ciclo si vienen en URL
  if (planFromUrl && state.plans[planFromUrl]) {
    state.selectedPlan = planFromUrl;
    debugLog('📦 Plan pre-seleccionado desde URL', planFromUrl);
  }
  
  if (cycleFromUrl === 'monthly' || cycleFromUrl === 'annual') {
    state.selectedCycle = cycleFromUrl;
    debugLog('💰 Ciclo pre-seleccionado desde URL', cycleFromUrl);
  }
  
  // Auth state observer
  auth.onAuthStateChanged(user => {
    debugLog('🔄 Auth State Changed', {
      isAuthenticated: !!user,
      userEmail: user ? user.email : null,
      userId: user ? user.uid : null,
      displayName: user ? user.displayName : null
    });
    
    if (user) {
      debugLog('✅ Usuario autenticado detectado');
      state.user = user;
      findRestaurantId(user.uid);
    } else {
      debugLog('❌ Usuario NO autenticado');
      
      if (token) {
        debugLog('🔑 Token detectado en URL - Intentando auto-login...');
        handleTokenLogin(token);
      } else {
        debugLog('ℹ️ No hay token - Mostrando pantalla de login');
        showStep(1);
      }
    }
  });
  
  initializeEventListeners();
  debugLog('✅ Event listeners inicializados');
});

// ============================================
// MANEJAR LOGIN CON TOKEN
// ============================================
function handleTokenLogin(token) {
  try {
    debugLog('🔑 === INICIO PROCESO DE AUTO-LOGIN ===');
    debugLog('📏 Token length (raw)', token.length);
    
    // Decodificar token
    const decodedToken = decodeURIComponent(token);
    debugLog('🔓 Token decodificado', {
      decodedLength: decodedToken.length,
      preview: decodedToken.substring(0, 50) + '...'
    });
    
    // Intentar login
    debugLog('🔐 Ejecutando signInWithCustomToken...');
    const startTime = Date.now();
    
    auth.signInWithCustomToken(decodedToken)
      .then((userCredential) => {
        const elapsedTime = Date.now() - startTime;
        debugLog('✅ LOGIN AUTOMÁTICO EXITOSO', {
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          timeElapsed: elapsedTime + 'ms'
        });
        
        // El onAuthStateChanged se encargará del resto
      })
      .catch((error) => {
        const elapsedTime = Date.now() - startTime;
        debugLog('❌ ERROR en signInWithCustomToken', {
          code: error.code,
          message: error.message,
          timeElapsed: elapsedTime + 'ms',
          tokenPreview: decodedToken.substring(0, 30) + '...'
        });
        
        let errorMessage = 'Error de autenticación';
        
        switch(error.code) {
          case 'auth/invalid-custom-token':
            errorMessage = 'Token inválido. Por favor intenta nuevamente desde la app.';
            debugLog('💡 Posibles causas', [
              'Token malformado o corrupto',
              'Token no codificado/decodificado correctamente',
              'Token expirado (>1 hora)'
            ]);
            break;
          case 'auth/custom-token-mismatch':
            errorMessage = 'Token de proyecto incorrecto. Contacta a soporte.';
            debugLog('💡 Posibles causas', [
              'Token generado para otro proyecto Firebase',
              'API Key incorrecta en firebaseConfig'
            ]);
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Error de conexión. Verifica tu internet.';
            debugLog('💡 Posibles causas', [
              'Sin conexión a internet',
              'Dominio no autorizado en Firebase',
              'Problemas de CORS'
            ]);
            break;
          default:
            errorMessage = `Error: ${error.message}`;
        }
        
        showError(errorMessage);
        showStep(1);
      });
  } catch (error) {
    debugLog('❌ ERROR CRÍTICO en handleTokenLogin', {
      message: error.message,
      stack: error.stack
    });
    showError('Error procesando el token');
    showStep(1);
  }
}

// ============================================
// BUSCAR RESTAURANTE DEL USUARIO
// ============================================
async function findRestaurantId(userId) {
  try {
    debugLog('🔍 === INICIO BÚSQUEDA DE RESTAURANTE ===');
    debugLog('👤 User ID', userId);
    
    // Mostrar loading
    showLoadingMessage('Cargando información del restaurante...');
    
    debugLog('📂 Accediendo a colección "Users"...');
    const userDocRef = db.collection('Users').doc(userId);
    debugLog('🔗 Referencia creada', userDocRef.path);
    
    debugLog('⏳ Ejecutando userDoc.get()...');
    const startTime = Date.now();
    
    const userDoc = await userDocRef.get();
    const elapsedTime = Date.now() - startTime;
    
    debugLog('✅ get() completado', {
      timeElapsed: elapsedTime + 'ms',
      exists: userDoc.exists
    });
    
    if (!userDoc.exists) {
      debugLog('❌ Documento NO existe - Intentando búsqueda alternativa...');
      
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No se puede buscar por email: usuario no tiene email');
      }
      
      debugLog('📧 Buscando por email', user.email);
      const queryStartTime = Date.now();
      
      const userSnapshot = await db.collection('Users')
        .where('email', '==', user.email)
        .limit(1)
        .get();
      
      const queryElapsedTime = Date.now() - queryStartTime;
      
      debugLog('📊 Resultados de búsqueda por email', {
        timeElapsed: queryElapsedTime + 'ms',
        size: userSnapshot.size,
        empty: userSnapshot.empty
      });
      
      if (userSnapshot.empty) {
        throw new Error('Usuario no encontrado en Firestore (ni por UID ni por email)');
      }
      
      const userData = userSnapshot.docs[0].data();
      debugLog('✅ Usuario encontrado por email', userData);
      
      const restaurantId = userData.idRestaurant;
      if (!restaurantId) {
        throw new Error('Usuario no tiene restaurante asignado (idRestaurant vacío)');
      }
      
      state.restaurantId = restaurantId;
      debugLog('✅ Restaurant ID asignado', restaurantId);
      
      hideLoadingMessage();
      proceedToStep2();
      return;
    }
    
    // Si el documento existe
    const userData = userDoc.data();
    debugLog('📄 Datos del usuario obtenidos', {
      hasData: !!userData,
      fields: userData ? Object.keys(userData) : []
    });
    
    debugLog('👤 Información del usuario', {
      id: userData.id,
      email: userData.email,
      idRestaurant: userData.idRestaurant,
      branchIds: userData.branchIds,
      role: userData.role
    });
    
    const restaurantId = userData.idRestaurant;
    
    if (!restaurantId) {
      throw new Error('Usuario no tiene restaurante asignado (campo idRestaurant vacío)');
    }
    
    debugLog('🏪 Verificando que el restaurante existe...');
    debugLog('📍 Restaurant ID a verificar', restaurantId);
    
    const restaurantStartTime = Date.now();
    const restaurantDoc = await db.collection('Restaurants').doc(restaurantId).get();
    const restaurantElapsedTime = Date.now() - restaurantStartTime;
    
    debugLog('✅ Verificación de restaurante completada', {
      timeElapsed: restaurantElapsedTime + 'ms',
      exists: restaurantDoc.exists
    });
    
    if (!restaurantDoc.exists) {
      throw new Error('Restaurante no encontrado en Firestore (ID: ' + restaurantId + ')');
    }
    
    const restaurantData = restaurantDoc.data();
    debugLog('🏪 Datos del restaurante', {
      name: restaurantData.name,
      email: restaurantData.email,
      plan: restaurantData.plan || 'Sin plan',
      premium: restaurantData.premium,
      subscriptionStatus: restaurantData.subscriptionStatus || 'Sin suscripción'
    });
    
    state.restaurantId = restaurantId;
    debugLog('✅✅✅ BÚSQUEDA COMPLETA - Restaurant ID asignado a state', restaurantId);
    
    hideLoadingMessage();
    proceedToStep2();
    
  } catch (error) {
    debugLog('❌ ERROR CRÍTICO en findRestaurantId', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    hideLoadingMessage();
    
    // Mensaje específico según el error
    let errorMessage = 'Error al cargar información del restaurante';
    let hints = [];
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Error de permisos en Firestore';
      hints = [
        'Verifica las reglas de Firestore',
        'Asegúrate de que el usuario autenticado tenga permisos de lectura',
        'Reglas recomendadas: allow read, write: if request.auth != null;'
      ];
    } else if (error.code === 'unavailable') {
      errorMessage = 'Firestore no disponible';
      hints = [
        'Problema de red o conectividad',
        'Verifica tu conexión a internet',
        'Puede ser un problema temporal de Firebase'
      ];
    } else if (error.message.includes('CORS')) {
      errorMessage = 'Error de conexión (CORS)';
      hints = [
        'GitHub Pages puede tener restricciones de CORS',
        'Considera migrar a Firebase Hosting',
        'O implementa un proxy en Cloud Functions'
      ];
    }
    
    debugLog('💡 Hints para solucionar', hints);
    
    showError(errorMessage + ': ' + error.message);
    showStep(1);
  }
}

function proceedToStep2() {
  debugLog('➡️ Procediendo al Step 2');
  debugLog('📦 Estado actual', {
    selectedPlan: state.selectedPlan,
    selectedCycle: state.selectedCycle,
    restaurantId: state.restaurantId
  });
  
  if (state.selectedPlan) {
    debugLog('✅ Plan pre-seleccionado - Aplicando selecciones...');
    showStep(2);
    setTimeout(() => {
      selectBillingCycle(state.selectedCycle);
      selectPlan(state.selectedPlan);
    }, 100);
  } else {
    debugLog('ℹ️ Sin plan pre-seleccionado - Mostrando selección de planes');
    showStep(2);
  }
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
  // AUTH - Toggle between login/register
  document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    debugLog('🔄 Cambiando a formulario de registro');
    document.getElementById('email-auth').classList.add('hidden');
    document.getElementById('register-auth').classList.remove('hidden');
  });
  
  document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    debugLog('🔄 Cambiando a formulario de login');
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
    debugLog('⬅️ Regresando a selección de planes');
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
  debugLog('🔐 === INICIO LOGIN MANUAL ===');
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loadingOverlay = document.getElementById('auth-loading');
  
  debugLog('📧 Email ingresado', email);
  
  try {
    loadingOverlay.classList.remove('hidden');
    debugLog('⏳ Intentando login...');
    
    const startTime = Date.now();
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const elapsedTime = Date.now() - startTime;
    
    debugLog('✅ Login manual EXITOSO', {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      timeElapsed: elapsedTime + 'ms'
    });
    
    // El onAuthStateChanged se encargará del resto
  } catch (error) {
    debugLog('❌ ERROR en login manual', {
      code: error.code,
      message: error.message
    });
    
    loadingOverlay.classList.add('hidden');
    
    let errorMessage = 'Error al iniciar sesión';
    switch(error.code) {
      case 'auth/wrong-password':
        errorMessage = 'Contraseña incorrecta';
        break;
      case 'auth/user-not-found':
        errorMessage = 'Usuario no encontrado';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos. Espera un momento.';
        break;
    }
    
    showError(errorMessage);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  debugLog('📝 === INICIO REGISTRO ===');
  
  const name = document.getElementById('register-name').value;
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const loadingOverlay = document.getElementById('auth-loading');
  
  debugLog('📋 Datos de registro', {
    name: name,
    email: email,
    passwordLength: password.length
  });
  
  try {
    loadingOverlay.classList.remove('hidden');
    
    debugLog('⏳ Creando usuario en Firebase Auth...');
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userCredential.user.uid;
    
    debugLog('✅ Usuario creado en Auth', userId);
    
    debugLog('⏳ Creando restaurante en Firestore...');
    const restaurantRef = await db.collection('Restaurants').add({
      name: name,
      email: email,
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
      subscriptionStartDate: 0,
      tipEnabled: false,
      tipPercentage: 10,
      tipText: 'Propina sugerida',
      tipAskPayment: false,
      businessType: '',
      cuisineType: ''
    });
    
    debugLog('✅ Restaurante creado', restaurantRef.id);
    
    debugLog('⏳ Creando usuario en Firestore...');
    await db.collection('Users').doc(userId).set({
      id: userId,
      idRestaurant: restaurantRef.id,
      branchIds: [],
      username: name,
      email: email,
      image: '',
      role: 'ADMIN',
      fcmToken: '',
      phone: ''
    });
    
    debugLog('✅ Usuario vinculado con restaurante');
    
    state.restaurantId = restaurantRef.id;
    debugLog('✅✅✅ REGISTRO COMPLETO');
    
    // El onAuthStateChanged se encargará del resto
  } catch (error) {
    debugLog('❌ ERROR en registro', {
      code: error.code,
      message: error.message
    });
    
    loadingOverlay.classList.add('hidden');
    
    let errorMessage = 'Error al crear cuenta';
    switch(error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'Este email ya está registrado';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Email inválido';
        break;
    }
    
    showError(errorMessage);
  }
}

// ============================================
// STEP 2: SELECCIÓN DE PLAN
// ============================================
function selectBillingCycle(cycle) {
  state.selectedCycle = cycle;
  debugLog('💰 Ciclo seleccionado', cycle);
  
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
}

function selectPlan(planId) {
  if (!state.plans[planId]) {
    debugLog('❌ Plan no válido', planId);
    return;
  }
  
  state.selectedPlan = planId;
  debugLog('📦 Plan seleccionado', {
    planId: planId,
    planName: state.plans[planId].name
  });
  
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
  
  debugLog('📋 Actualizando resumen de confirmación', {
    plan: plan.name,
    cycle: cycle
  });
  
  document.getElementById('summary-plan-name').textContent = `Plan ${plan.name}`;
  document.getElementById('summary-billing-cycle').textContent = 
    cycle === 'annual' ? 'Anual' : 'Mensual';
  
  const priceText = cycle === 'annual' 
    ? `Q${plan.annualTotal} (Q${plan.annualPrice}/mes)`
    : `Q${plan.monthlyPrice}/mes`;
  
  document.getElementById('summary-total').textContent = priceText;
  document.getElementById('summary-email').textContent = state.user?.email || '';
}

async function handleProceedToPayment() {
  debugLog('💳 === INICIO PROCESO DE PAGO ===');
  
  if (!state.restaurantId || !state.selectedPlan) {
    debugLog('❌ Información incompleta', {
      restaurantId: state.restaurantId,
      selectedPlan: state.selectedPlan
    });
    showError('Información incompleta. Por favor recarga la página.');
    return;
  }
  
  const loadingOverlay = document.getElementById('payment-loading');
  
  try {
    loadingOverlay.classList.remove('hidden');
    
    debugLog('🚀 Creando sesión de checkout en Recurrente...');
    debugLog('📝 Datos para checkout', {
      restaurantId: state.restaurantId,
      planId: state.selectedPlan,
      billingCycle: state.selectedCycle
    });
    
    const createCheckoutSession = functions.httpsCallable('createCheckoutSession');
    const startTime = Date.now();
    
    const result = await createCheckoutSession({
      restaurantId: state.restaurantId,
      planId: state.selectedPlan,
      billingCycle: state.selectedCycle,
      successUrl: 'https://comandaya.com/checkout/success.html?session_id={CHECKOUT_SESSION_ID}',
      cancelUrl: 'https://comandaya.com/checkout/?cancelled=true'
    });
    
    const elapsedTime = Date.now() - startTime;
    
    debugLog('✅ Sesión creada', {
      timeElapsed: elapsedTime + 'ms',
      response: result.data
    });
    
    if (result.data.success && result.data.checkoutUrl) {
      debugLog('🔗 Redirigiendo a Recurrente...', result.data.checkoutUrl);
      window.location.href = result.data.checkoutUrl;
    } else {
      throw new Error('No se obtuvo URL de checkout');
    }
  } catch (error) {
    debugLog('❌ ERROR creando checkout', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    
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
  debugLog('📍 Cambiando a Step ' + stepNumber);
  
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
}

// ============================================
// UTILIDADES
// ============================================
function showLoadingMessage(message) {
  debugLog('⏳ Mostrando loading', message);
  
  let loadingDiv = document.getElementById('loading-message');
  if (!loadingDiv) {
    loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-message';
    loadingDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 9999;
      text-align: center;
    `;
    document.body.appendChild(loadingDiv);
  }
  
  loadingDiv.innerHTML = `
    <div class="spinner" style="
      border: 4px solid #f3f3f3;
      border-top: 4px solid #FFD700;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    "></div>
    <p style="margin: 0; font-weight: 600; color: #333;">${message}</p>
  `;
  loadingDiv.style.display = 'block';
}

function hideLoadingMessage() {
  debugLog('✅ Ocultando loading');
  const loadingDiv = document.getElementById('loading-message');
  if (loadingDiv) {
    loadingDiv.style.display = 'none';
  }
}

function showError(message) {
  debugLog('⚠️ Mostrando error', message);
  
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
      z-index: 10001;
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

// Agregar CSS para animación del spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// ============================================
// LOG DE INICIO
// ============================================
debugLog('✅ Checkout script cargado completamente');
debugLog('🔧 Configuración final', {
  projectId: firebaseConfig.projectId,
  domain: window.location.hostname,
  debugMode: DEBUG_MODE
});