const Router = require('express');
const router = new Router();
const filmController = require('../controller/film.controller');

router.post('/film', filmController.creatFilm);
router.get('/film', filmController.getAllFilms);
router.get('/film/:name', filmController.getFilmByName);
router.put('/film', filmController.updateFilm);
router.delete('/film/:name', filmController.deleteFilm);


module.exports = router;