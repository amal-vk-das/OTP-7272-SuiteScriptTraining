/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/render', 'N/runtime', 'N/search','N/file'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 * @param{file} file
 */
    (email, record, render, runtime, search, file) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
 
         try{
           
            let searchCustomer = search.create({
                type: search.Type.CUSTOMER,
                filters: [['datecreated','within','thismonth'],'AND',
            ['isinactive','is','F']],
                columns: ['companyname','datecreated','salesrep','terms','firstname','lastname']
 
            })
 
            let csvContent = 'Name,Date Created,Sales Rep,Terms\n';
 
            searchCustomer.run().each(result=>{
                let customer = result.getValue({name:'companyname'});
                let firstname = result.getValue({name:'firstname'});
                let lastname = result.getValue({name:'lastname'});
                let dateCreated = result.getValue({name:'datecreated'});
                let salesRep = result.getText({name:'salesrep'});
                let terms = result.getValue({name:'terms'});
 
                csvContent+=(customer || firstname+' '+lastname)+','+dateCreated+','+salesRep+','+terms
                csvContent += '\n';
                return true
               
            })
 
 
            let csvFile =file.create({
                name: 'Monthly New Customer List.csv',
                fileType: file.Type.CSV,
                contents: csvContent,
                isInline: true,
                folder: 305
            })

            csvFile.save()
 
            email.send({
                author: -5,
                recipients: 1916,
                subject: 'Monthly Customer List',
                body: "Monthly Customer Report",
                attachments: [csvFile]
            })
 
         }
         catch(e){
            log.error('Error',e)
            }
 
             
        }
 
        return {execute}
 
    });