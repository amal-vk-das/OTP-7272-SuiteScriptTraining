/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/search', 'N/log'],
    /**
     * @param{record} record
     * @param{search} search
     * @param{log} log
     */
    (record, search, log) => {
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
            let customerSearch = search.create({
                type: search.Type.CUSTOMER,
                title: 'Customer Search',
                id: 'customsearch_jj_customer_search',
                columns: ['companyname','firstname','subsidiary', 'salesrep', 'email', 'datecreated'],
                filters: [
                    ['datecreated', 'within', 'lastmonth'],
                    'and', ['subsidiary', 'anyof', 'Anything Phones']
                ]
            });

            customerSearch.run().each(function(result) {
                let companyname = result.getValue({ name: 'companyname' });
                let firstname = result.getValue({ name: 'firstname' });
                let subsidiary = result.getText({ name: 'subsidiary' });
                let salesrep = result.getText({ name: 'salesrep' });
                let email = result.getValue({ name: 'email' });
                let dateCreated = result.getValue({ name: 'datecreated' });


                let name = companyname ? `Company Name: ${companyname}` : `First Name: ${firstname}`;

                log.debug(`${name}, Subsidiary: ${subsidiary}, Sales Rep: ${salesrep}, Email: ${email}, Date Created: ${dateCreated}`);

                return true;
            });
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
