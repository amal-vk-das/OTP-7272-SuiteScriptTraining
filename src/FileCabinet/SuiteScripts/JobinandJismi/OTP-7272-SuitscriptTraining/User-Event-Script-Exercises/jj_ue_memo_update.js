/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
        const afterSubmit = (scriptContext) => {
            try {
                if (scriptContext.type == scriptContext.UserEventType.CREATE) {
                  var newRecord = scriptContext.newRecord;
                  if (newRecord.type == record.Type.SALES_ORDER) {
                    let isChecked = newRecord.getValue("custbody_jj_memoupdated");
                    log.debug(isChecked)
                    let recordId = newRecord.id;
                    log.debug(recordId)
                    if(isChecked == true){
                        record.submitFields({
                            type: record.Type.SALES_ORDER,
                            id: recordId,
                            values: {
                                memo: "Memo updated",
                            },
                          });
                          log.debug(
                            "Memo field updated"
                          );
                    }
                  }
                }
              } catch (e) {
                log.error("Error updating memo field", e);
              }
        }

        return {afterSubmit}

    });
