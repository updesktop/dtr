const fs = require('fs');
const readline = require('readline');

// Function to read records from the file
function readRecords(callback) {
  fs.readFile('records.json', 'utf8', (err, data) => {
    if (err) {
      return callback(err);
    }
    const records = JSON.parse(data);
    callback(null, records);
  });
}

// Function to write records back to the file
function writeRecords(records, callback) {
  fs.writeFile('records.json', JSON.stringify(records, null, 2), 'utf8', (err) => {
    if (err) {
      return callback(err);
    }
    callback(null);
  });
}

// Function to lock a record
function lockRecord(recordId, callback) {
  readRecords((err, records) => {
    if (err) {
      return callback(err);
    }

    const record = records.find((r) => r.id === recordId);
    if (!record) {
      return callback(new Error('Record not found'));
    }

    if (record.locked) {
      return callback(new Error('Record is already locked'));
    }

    record.locked = true;

    writeRecords(records, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null, record);
    });
  });
}

// Function to unlock a record
function unlockRecord(recordId, callback) {
  readRecords((err, records) => {
    if (err) {
      return callback(err);
    }

    const record = records.find((r) => r.id === recordId);
    if (!record) {
      return callback(new Error('Record not found'));
    }

    if (!record.locked) {
      return callback(new Error('Record is not locked'));
    }

    record.locked = false;

    writeRecords(records, (err) => {
      if (err) {
        return callback(err);
      }
      callback(null, record);
    });
  });
}

// Example usage
lockRecord(1, (err, lockedRecord) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Locked record: ${JSON.stringify(lockedRecord)}`);

  // Simulate some processing
  setTimeout(() => {
    unlockRecord(1, (err, unlockedRecord) => {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Unlocked record: ${JSON.stringify(unlockedRecord)}`);
    });
  }, 5000); // Simulate a 5-second processing time
});
