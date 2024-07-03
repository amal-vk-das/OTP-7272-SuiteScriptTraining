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
 
            if(scriptContext.type === scriptContext.UserEventType.CREATE){
               
                var newRecord = scriptContext.newRecord;
                var entityId = newRecord.id;
                var entityType = newRecord.type;
                var userId = runtime.getCurrentUser().id
                var name = newRecord.getValue("companyname") || newRecord.getValue("firstname") || newRecord.getValue("entityid")
 
                var authorId = 1916
 
 
                email.send({
                    author: authorId,
                    body: "Internal ID :"+entityId+ "EntityType :"+entityType+"Name"+name,
                    recipients: userId,
                    subject: "New Record Created 123456",
                   
                })
                log.debug("New Record Created")
                log.debug(userId)
 
 
 
 
            }
            else if(scriptContext.type === scriptContext.UserEventType.DELETE){
 
                var deletedRecord = scriptContext.oldRecord;
                var entityId = deletedRecord.id;
                var entityType = deletedRecord.type;
                var userId = runtime.getCurrentUser().id
                var name = deletedRecord.getValue("companyname") || deletedRecord.getValue("firstname")
 
                var authorId = 2046
 
                email.send({
                    author: authorId,
                    body: "Internal ID :"+entityId+ "EntityType :"+entityType+"Name"+name,
                    recipients: userId,
                    subject: "New Record Deleted",
                   
                })
                log.debug("New Record Deleted")
 
            }
 
 
 
 
        }
 
        return {afterSubmit}
 
    });
 