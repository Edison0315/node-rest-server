// ============
// Puerto
// ============
// @param = process.env.PORT = esta variable la da heroku
process.env.PORT = process.env.PORT || 3000;

// ============
// Entorno
// ============
// @param = process.env.PORT = esta variable solo existe en heroku
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
// Vencimiento del token
// =====================
// 60 sec
// 60 mins
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = '78h';

// =====================
// SEED de autenticacion
// =====================
// @param = process.env.SEED = esta variable es creada en heroku
process.env.SEED = process.env.SEED || 'este-es-el-seed-dev'; 

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
