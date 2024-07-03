/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
     * @param {search} search
     */
    (search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
            try{
            let creditMemoSearch = search.create({
                type: search.Type.CREDIT_MEMO,
                title: 'Fetch Credit Memo Search JJ',
                id: 'customsearch_jj_fetchcreditmemos',
                columns: ['tranid','trandate','total','statusref'],
                filters: [
                    ['entity', 'is', '1670'],
                    'AND',
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['taxline', 'is', 'F'],
                    'AND',
                    ['cogs', 'is', 'F']
                ]
            });

            creditMemoSearch.run().each(function(result) {
                let transactionId = result.getValue({ name: 'tranid' });
                let transactionDate = result.getValue({ name: 'trandate' });
                let totalAmount = Math.abs(result.getValue({ name: 'total' }));
                let status = result.getText({ name: 'statusref' });

                log.debug({
                    title: "Fetch Credit Memo",
                    details:`Transaction ID: ${transactionId}, Transaction Date: ${transactionDate}, Total Amount: ${totalAmount}, Status: ${status}` 
                })
                return true;
            });
        }
        catch(e){
            log.error('Error in fetching credit memo', e);
        }
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            // Your beforeSubmit logic here
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
            // Your afterSubmit logic here
        }

        return { beforeLoad, beforeSubmit, afterSubmit }
    });