const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGO_URI;

async function dropIndex() {
    try {
        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        // Get the UserModel collection
        const collection = mongoose.connection.collection('usermodels');
        
        // List all indexes
        const indexes = await collection.getIndexes();
        console.log('Current indexes:', indexes);

        // Drop problematic indexes if they exist
        const indexesToDrop = ['id_1', 'nic_1'];
        for (const indexName of indexesToDrop) {
            if (indexName in indexes) {
                await collection.dropIndex(indexName);
                console.log(`Dropped index: ${indexName}`);
            }
        }

        console.log('Index cleanup complete');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

dropIndex();
