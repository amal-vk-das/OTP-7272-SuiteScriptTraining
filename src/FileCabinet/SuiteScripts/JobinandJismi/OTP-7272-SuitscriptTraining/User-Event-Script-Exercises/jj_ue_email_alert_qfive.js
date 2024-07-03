/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/email", "N/record", "N/runtime", "N/search"], /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
(email, record, runtime, search) => {
  /**
   * Defines the function definition that is executed before record is loaded.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @param {Form} scriptContext.form - Current form
   * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
   * @since 2015.2
   */
  const beforeLoad = (scriptContext) => {};

  /**
   * Defines the function definition that is executed before record is submitted.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @since 2015.2
   */
  const beforeSubmit = (scriptContext) => {};

  /**
   * Defines the function definition that is executed after record is submitted.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @since 2015.2
   */
  const afterSubmit = (scriptContext) => {
    if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
      return;
    }

    let newRecord = scriptContext.newRecord;
    let customerId = newRecord.getValue("entity");
    let senderId = runtime.getCurrentUser().id;
    let salesRepId = newRecord.getValue("salesrep");

    let customerRecord = record.load({
      type: record.Type.CUSTOMER,
      id: customerId,
    });

    let customerOverdueCount = customerRecord.getValue("daysoverdue");

    if (customerOverdueCount > 0) {
      let employeeRecord = record.load({
        type: record.Type.EMPLOYEE,
        id: salesRepId,
      })
      let salesManagerId = employeeRecord.getValue("supervisor");

      let recipientId = salesManagerId;
      let subject = "Customer has overdue";
      let body =
        "The customer with ID " +
        customerId +
        " has overdue of " +
        customerOverdueCount +
        "days";

      email.send({
        author: senderId,
        recipients: recipientId,
        subject: subject,
        body: body,
      });
    } else {
      log.debug({
        title: "Overdue Status",
        details: "Customer has no overdue",
      });
    }
  };

  return { beforeLoad, beforeSubmit, afterSubmit };
});
