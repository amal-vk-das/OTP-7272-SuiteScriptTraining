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
           if (newRecord.type == record.Type.PURCHASE_ORDER) {
             var vendorId = newRecord.getValue("entity");
             var vendorRecord = record.submitFields({
               type: record.Type.VENDOR,
               id: vendorId,
               values: {
                custentity_jj_purchaseordercheckbox: true,
               },
             });
             log.debug(
               "Vendor Updated",
               "Checked the purchase order checkbox for vendor ID: " + vendorId
             );
           }
         }
       } catch (e) {
         log.error("Error updating vendor records", e);
       }
     };
   
     return { afterSubmit };
   });
   