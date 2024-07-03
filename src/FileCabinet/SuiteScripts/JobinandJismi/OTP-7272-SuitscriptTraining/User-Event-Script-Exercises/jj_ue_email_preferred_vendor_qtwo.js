/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search) => {

        const afterSubmit = (scriptContext) => {
            if (scriptContext.type !== scriptContext.UserEventType.CREATE) {
                return;
              }
          
              let purchaseOrder = scriptContext.newRecord;
              let itemCount = purchaseOrder.getLineCount({ sublistId: "item" });
              let employeeId = purchaseOrder.getValue({ fieldId: "employee" });

          
              for (let i = 0; i < itemCount; i++) {
                let itemId = purchaseOrder.getSublistValue({
                  sublistId: "item",
                  fieldId: "item",
                  line: i,
                });
          
                let itemRecord = record.load({
                  type: record.Type.INVENTORY_ITEM,
                  id: itemId,
                });
          
                let preferredVendor = itemRecord.getValue({ fieldId: "preferredvendor" });
          
                if (!preferredVendor) {
                  let itemName = itemRecord.getValue({ fieldId: "itemid" });
                //   let currentEmployeeId = runtime.getCurrentUser().id;
                  email.send({
                    author: runtime.getCurrentUser().id,
                    recipients: employeeId,
                    subject: "Preferred Vendor Missing",
                    body:
                      "No preferred vendor is added for the item " +
                      itemName +
                      ". Please update the preferred vendor.",
                  });
                  log.debug("Preferred vendor not available")
                }
                else{
                    log.debug("Preferred vendor is present.")
                }
              }
        }

        return {afterSubmit}

    });
