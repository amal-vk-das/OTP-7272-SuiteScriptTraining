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
            let fetchSalesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                title: 'Fetch Sales Order JJ',
                id: 'customsearch_jj_fetchsalesorders',
                columns: ['tranid','trandate','entity','subsidiary','amount','statusref'],
                filters: [
                    ['status', 'anyof', 'SalesOrd:B'],
                    'AND',
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['taxline', 'is', 'F'],
                    'AND',
                    ['cogs', 'is', 'F']
                ]
            });

            fetchSalesOrderSearch.run().each(function(result) {
                let documentNumber = result.getValue({ name: 'tranid' });
                let date = result.getValue({ name: 'trandate' });
                let customerName = result.getText({ name: 'entity' });
                let subsidiary = result.getText({ name: 'subsidiary' });
                let amount = result.getValue({ name: 'amount' });
                let status = result.getText({ name: 'statusref' });

                log.debug({
                    title: "Sales Order Fetch",
                    details: `Document Number: ${documentNumber}, Date: ${date},Status: ${status}, Customer Name: ${customerName}, Subsidiary: ${subsidiary}, Amount: ${amount}`
                })
                return true;
            });
        }
        catch(e){
            log.error('Error in fetching sales orders', e);
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