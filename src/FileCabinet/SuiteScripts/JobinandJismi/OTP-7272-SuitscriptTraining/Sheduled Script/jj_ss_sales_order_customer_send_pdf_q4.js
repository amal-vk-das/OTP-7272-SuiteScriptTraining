/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/record', 'N/runtime', 'N/search','N/render','N/email'],
    /**
 * @param{record} record
 * @param{runtime} runtime
 * @param{search} search
 * @param{render} render
 * @param{email} email
 */
    (record, runtime, search,render,email) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
 
            let searchRec = search.create({
                type: search.Type.SALES_ORDER,
                filters: [['trandate','on','today'],'AND',
                ['mainline','is','T']],
                columns: ['trandate','entity','tranid','internalid']
 
            })
 
            searchRec.run().each(result=>{
               
                try{
                let name = result.getValue('entity')
                let salesOrderId = parseInt(result.getValue('internalid'))
                log.debug(salesOrderId)
 
                pdfContents ="Sales Order Details"
                let pdf = render.transaction({
                    entityId: salesOrderId,
                    printMode:render.PrintMode.PDF
                })
 
                email.send({
                    author: 1916,
                    recipients: name,
                    subject: 'Sales Order',
                    body: pdfContents,
                    attachments: [pdf]
                })

                return true

                }
                catch(e){
                    log.error(e)
                    return false
                    }
 
            })
 
 
 
        }
 
        return {execute}
 
    });