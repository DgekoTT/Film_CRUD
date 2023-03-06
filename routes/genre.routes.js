const Router = require('express');
const router = new Router();
const genreController = require('../controller/genre.controller');

router.post('/genre', genreController.creatGenre);
router.get('/genre', genreController.getAllGenre);
router.get('/genre/:name', genreController.getGenreByName);
router.put('/genre', genreController.updateGenre);
router.delete('/genre/:name', genreController.deleteGenre);


module.exports = router;