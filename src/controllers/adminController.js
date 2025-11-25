const { adminService } = require('../services');

/**
 * Admin controller handles HTTP requests for administrative operations
 */
const adminController = {
  /**
   * Get system dashboard
   */
  getDashboard(req, res, next) {
    try {
      const dashboard = adminService.getDashboard();
      res.json(dashboard);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get user report
   */
  getUserReport(req, res, next) {
    try {
      const report = adminService.getUserReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get property report
   */
  getPropertyReport(req, res, next) {
    try {
      const report = adminService.getPropertyReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get rental agreement report
   */
  getRentalAgreementReport(req, res, next) {
    try {
      const report = adminService.getRentalAgreementReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get tenant report
   */
  getTenantReport(req, res, next) {
    try {
      const report = adminService.getTenantReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get activity summary
   */
  getActivitySummary(req, res, next) {
    try {
      const summary = adminService.getActivitySummary();
      res.json(summary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get full system report
   */
  getFullReport(req, res, next) {
    try {
      const report = adminService.getFullReport();
      res.json(report);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = adminController;
