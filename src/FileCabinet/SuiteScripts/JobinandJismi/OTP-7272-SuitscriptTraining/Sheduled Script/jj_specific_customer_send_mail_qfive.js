/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/render', 'N/runtime', 'N/search'],
    /**
 * @param{email} email
 * @param{record} record
 * @param{render} render
 * @param{runtime} runtime
 * @param{search} search
 */
    (email, record, render, runtime, search) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
 
            try{
                let searchResult = search.create({
                    type: search.Type.CUSTOMER,
                    filters: [['subsidiary','is','19'],'AND',
                    [['firstname','startswith','a'],'OR',
                ['companyname','startswith','a']]],
                    columns:['internalid','email','subsidiary']
                })
 
                searchResult.run().each(result => {
                    let customer = parseInt(result.getValue('internalid'))
                   
                   
                    log.debug(`Processing customer `+customer);
                   
                        email.send({
                            author: -5,
                            recipients: customer,
                            subject: 'Daily Update',
                            body: 'Dear ' + customer + ',\n\nThis is your daily update.'
                        });
                   
                   
                    return true;
                });
 
            }
            catch(e){
                log.error(
                     'Error in Scheduled script',e);
            }
 
 
 
        }
 
        return {execute}
 
    });
 