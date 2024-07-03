/**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(["N/record"], (record) => {
    /**
     * Defines the Mass Update trigger point.
     * @param {Object} params
     * @param {string} params.type - Record type of the record being processed
     * @param {number} params.id - ID of the record being processed
     * @since 2016.1
     */
    const each = (params) => {
      let recordId = params.id;
      let recordType = params.type;
  
      try {
        let invoiceRecord = record.load({
          type: recordType,
          id: recordId,
          isDynamic: true,
        });
  
        let currentDueDate = invoiceRecord.getValue({
          fieldId: "duedate",
        });
  
        // Parse current due date to a Date object
        let currentDueDateObj = new Date(currentDueDate);
  
        // Increase due date by 15 days
        currentDueDateObj.setDate(currentDueDateObj.getDate() + 15);
  
        log.debug({
          title: "Current Date:",
          details: currentDueDateObj,
        });
  
        // Set the new due date on the record
        invoiceRecord.setValue({
          fieldId: "duedate",
          value: currentDueDateObj,
        });
  
        // Ensure other required fields are set here if needed
        // For example:
        // invoiceRecord.setValue({
        //   fieldId: "location",
        //   value: someLocationValue, // Set the appropriate location value
        // });
  
        // Save the record
        let recordIdAfterSave = invoiceRecord.save({
          ignoreMandatoryFields: true // Optional: Ignore mandatory fields to avoid validation errors
        });
  
        log.debug({
          title: "Record ID after save:",
          details: recordIdAfterSave,
        });
  
      } catch (e) {
        log.error({
          title: "Error",
          details: e,
        });
      }
    };
  
    return { each };
  });
  