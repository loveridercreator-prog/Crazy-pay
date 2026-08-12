

// MODULE 4: DIRECT UPI PIN ENTRY DEEP-LINKING
function launchUPIIntent(upiId, name, amount, orderId, gateway) {
    const formattedAmount = Number(amount).toFixed(2); // Strict 2 decimal places
    const uriString = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${formattedAmount}&tr=${encodeURIComponent(orderId)}&cu=INR&tn=${encodeURIComponent(orderId)}`;
    
    // Target Mobikwik specifically or fallback to generic
    let finalUri = uriString;
    
    // We can try an intent schema for Android
    let intentUri = `intent://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${formattedAmount}&tr=${encodeURIComponent(orderId)}&cu=INR&tn=${encodeURIComponent(orderId)}#Intent;scheme=upi;`;
    if (gateway && gateway.toLowerCase().includes('mobikwik')) {
        intentUri += `package=com.mobikwik_new;`;
    }
    intentUri += `end;`;

    // Attempt to open the intent
    window.location.href = intentUri;
    
    // Fallback if intent fails
    setTimeout(() => {
        window.location.href = uriString;
    }, 1000);
}
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    },
                    colors: {
                        primary: '#3B82F6',
                        success: '#10B981',
                        error: '#EF4444',
                        warning: '#F59E0B',
                        slateDark: '#0B132B',
                        cardDark: '#1C2541'
                    }
                }
            }
        }
    