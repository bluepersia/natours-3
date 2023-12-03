const express = require ('express');
const tourController = require ('../controllers/tourController');
const router = express.Router ();

router.get ('/top5Cheap', tourController.top5Cheap, tourController.getAllTours);
router.get ('/tour-stats', tourController.getTourStats);

router.route ('/').get (tourController.getAllTours).post (tourController.createTour);
router.route ('/:id').get (tourController.getTour).patch (tourController.updateTour).delete (tourController.deleteTour);

module.exports = router;