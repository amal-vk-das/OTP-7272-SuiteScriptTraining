/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(["N/record"], /**
 * @param{record} record
 */ (record) => {
  /**
   * Defines the function definition that is executed after record is submitted.
   * @param {Object} scriptContext
   * @param {Record} scriptContext.newRecord - New record
   * @param {Record} scriptContext.oldRecord - Old record
   * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
   * @since 2015.2
   */
  const afterSubmit = (scriptContext) => {
    try {
      if (scriptContext.type == scriptContext.UserEventType.CREATE) {
        var newRecord = scriptContext.newRecord;
        if (newRecord.type == record.Type.SALES_ORDER) {
          var customerId = newRecord.getValue("entity");
          var customerRecord = record.submitFields({
            type: record.Type.CUSTOMER,
            id: customerId,
            values: {
              custentity_jj_salesordercheckbox: true,
            },
          });
          log.debug(
            "Customer Updated",
            "Checked the sales order checkbox for customer ID: " + customerId
          );
        }
      }
    } catch (e) {
      log.error("Error updating customer records", e);
    }
  };

  return { afterSubmit };
});
