/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, runtime, search) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
 
 
            let invoiceRec = search.create({
                type: search.Type.INVOICE,
                filters: [['mainline','is','T'],'AND',
                ['status','anyof','CustInvc:A']],
                columns:['tranid','entity']
               
            })
 
            let detailsHtml = "<h2>Sales order details</h2>";
 
    invoiceRec.run().each(function (result) {
      detailsHtml +=
        "<p><b>transaction number:</b> " +
        result.getValue({ name: "tranid" }) +
        "</p>";
     
      detailsHtml +=
        "<p><b>Customer:</b> " + result.getText({ name: "entity" }) + "</p><br>";
 
      return true;
    });
         
            email.send({
                author: 1916,
                recipients: -5,
                subject: 'New Invoices',
                body: detailsHtml
            })
        }
 
        return {execute}
 
    });