// Quick script to check user credits in Firestore
const admin = require('firebase-admin');

// Initialize Firebase Admin (uses default credentials from Firebase CLI)
admin.initializeApp();

const db = admin.firestore();

async function checkUserCredits(email) {
    try {
        // Get user by email
        const userRecord = await admin.auth().getUserByEmail(email);
        console.log(`✅ Found user: ${userRecord.uid}`);

        // Get Firestore document
        const userDoc = await db.collection('users').doc(userRecord.uid).get();

        if (userDoc.exists) {
            const data = userDoc.data();
            console.log('\n📊 User Data:');
            console.log('  Credits:', data.credits);
            console.log('  Subscription Tier:', data.subscriptionTier);
            console.log('  Subscription Status:', data.subscriptionStatus);
            console.log('  Last Payment Plan:', data.lastPaymentPlan);
            console.log('  Last Payment Date:', data.lastPaymentDate?.toDate());
            console.log('  Subscription End Date:', data.subscriptionEndDate?.toDate());
        } else {
            console.log('❌ User document not found in Firestore');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Run with email from command line
const email = process.argv[2] || 'hoaandrey@gmail.com';
console.log(`🔍 Checking credits for: ${email}\n`);
checkUserCredits(email);
