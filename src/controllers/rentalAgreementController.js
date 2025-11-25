const { rentalAgreementService } = require('../services');

/**
 * Rental Agreement controller handles HTTP requests for agreement operations
 */
const rentalAgreementController = {
  /**
   * Create a new rental agreement
   */
  createAgreement(req, res, next) {
    try {
      const agreementData = {
        ...req.body,
        landlordId: req.user.id
      };
      const agreement = rentalAgreementService.createAgreement(agreementData);
      res.status(201).json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get agreement by ID
   */
  getAgreementById(req, res, next) {
    try {
      const agreement = rentalAgreementService.getAgreementById(req.params.id);
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all agreements (admin only)
   */
  getAllAgreements(req, res, next) {
    try {
      const agreements = rentalAgreementService.getAllAgreements();
      res.json(agreements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get agreements by tenant
   */
  getAgreementsByTenant(req, res, next) {
    try {
      const tenantId = req.params.tenantId || req.user.id;
      const agreements = rentalAgreementService.getAgreementsByTenant(tenantId);
      res.json(agreements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get agreements by landlord
   */
  getAgreementsByLandlord(req, res, next) {
    try {
      const landlordId = req.params.landlordId || req.user.id;
      const agreements = rentalAgreementService.getAgreementsByLandlord(landlordId);
      res.json(agreements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get agreements by property
   */
  getAgreementsByProperty(req, res, next) {
    try {
      const agreements = rentalAgreementService.getAgreementsByProperty(req.params.propertyId);
      res.json(agreements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get active agreements
   */
  getActiveAgreements(req, res, next) {
    try {
      const agreements = rentalAgreementService.getActiveAgreements();
      res.json(agreements);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update agreement
   */
  updateAgreement(req, res, next) {
    try {
      const agreement = rentalAgreementService.updateAgreement(
        req.params.id,
        req.body,
        req.user.id,
        req.user.role
      );
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Sign agreement by tenant
   */
  signByTenant(req, res, next) {
    try {
      const agreement = rentalAgreementService.signByTenant(req.params.id, req.user.id);
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Sign agreement by landlord
   */
  signByLandlord(req, res, next) {
    try {
      const agreement = rentalAgreementService.signByLandlord(req.params.id, req.user.id);
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Send agreement for signing
   */
  sendForSigning(req, res, next) {
    try {
      const agreement = rentalAgreementService.sendForSigning(req.params.id, req.user.id);
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Terminate agreement
   */
  terminateAgreement(req, res, next) {
    try {
      const agreement = rentalAgreementService.terminateAgreement(
        req.params.id,
        req.body.reason,
        req.user.id,
        req.user.role
      );
      res.json(agreement);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete agreement (admin only)
   */
  deleteAgreement(req, res, next) {
    try {
      const result = rentalAgreementService.deleteAgreement(req.params.id, req.user.role);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get agreement statistics
   */
  getAgreementStatistics(req, res, next) {
    try {
      const stats = rentalAgreementService.getAgreementStatistics();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = rentalAgreementController;
