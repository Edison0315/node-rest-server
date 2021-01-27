// ============
// Puerto
// ============
process.env.PORT = process.env.PORT || 3000;

// ============
// Entorno
// ============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ============
// DB
// ============
let urlDB;

if(process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://root:0jF9xZDgWtijI89C@cluster0.myloa.mongodb.net/test';
}

process.env.URLDB = urlDB;
