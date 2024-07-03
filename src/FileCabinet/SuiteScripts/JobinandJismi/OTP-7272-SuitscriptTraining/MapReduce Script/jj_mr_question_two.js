/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

define(['N/email', 'N/record', 'N/search'],
    /**
     * @param {import('N/email')} email
     * @param {import('N/record')} record
     * @param {import('N/search')} search
     */
    (email, record, search) => {

        /**
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation is a restart
         * @param {search.ResultSet} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} id - Internal ID of the record instance that contains the input data
         * @property {string} type - Type of the record instance that contains the input data
         * @returns {search.ResultSet} The input data to use in the map/reduce process
         * @since 2015.2
         */
        const getInputData = (inputContext) => {
            let salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ['datecreated', 'within', 'lastfiscalquarter'],
                    'AND',
                    ['mainline', 'is', 'T'],
                    'AND',
                    ['status', 'anyof', 'SalesOrd:B'],
                ],
                columns: ['internalid', 'salesrep']
            });

            return salesOrderSearch;
        };

        /**
         * @param {Object} mapContext - Data collection containing the key-value pairs to process
         * @param {Iterator} mapContext.errors - Serialized errors from previous map attempts
         * @param {number} mapContext.executionNo - Number of times the map function has been executed
         * @param {boolean} mapContext.isRestarted - Indicates if the map function is restarted
         * @param {string} mapContext.key - Key to process in the map stage
         * @param {string} mapContext.value - Value to process in the map stage
         * @since 2015.2
         */
        const map = (mapContext) => {
            let result = JSON.parse(mapContext.value);

            let salesOrderId = result.id;
            let salesRepId = result.values.salesrep ? result.values.salesrep.value : 'admin';

            try {
                record.submitFields({
                    type: record.Type.SALES_ORDER,
                    id: salesOrderId,
                    values: {
                        status: 'A'
                    },
                    options: {
                        ignoreMandatoryFields: true
                    }
                });

                let recipientEmail = salesRepId === 'admin' ? -5 :  salesRepId;
                let subject = 'Sales Order Status Update';
                let body = salesRepId ?
                    'Sales order status has been updated to Pending Fulfillment.' :
                    'A sales order without a sales rep has been updated to Pending Fulfillment. Please assign a sales rep.';

                email.send({
                    author: 969,
                    recipients: recipientEmail,
                    subject: subject,
                    body: body
                });

                log.debug('Email sent to: ' + recipientEmail);
            } catch (e) {
                log.error({
                    title: 'Error updating sales order ' + salesOrderId,
                    details: e
                });
            }
        };

        /**
         * @param {Object} reduceContext - Data collection containing groups to process
         * @param {Iterator} reduceContext.errors - Serialized errors from previous reduce attempts
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed
         * @param {boolean} reduceContext.isRestarted - Indicates if the reduce function is restarted
         * @param {string} reduceContext.key - Key to process in the reduce stage
         * @param {Array<string>} reduceContext.values - All values associated with a unique key passed to reduce
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
        };

        /**
         * @param {Object} summaryContext - Statistics about the script execution
         * @param {number} summaryContext.concurrency - Maximum concurrency for parallel tasks
         * @param {Date} summaryContext.dateCreated - Date and time script began
         * @param {boolean} summaryContext.isRestarted - Indicates if the script execution is a restart
         * @param {Iterator} summaryContext.output - Serialized keys and values saved during reduce
         * @param {number} summaryContext.seconds - Total execution time in seconds
         * @param {number} summaryContext.usage - Total governance units consumed
         * @param {number} summaryContext.yields - Total number of yield points
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            log.audit('Usage Consumed', summaryContext.usage);
            log.audit('Concurrency', summaryContext.concurrency);
            log.audit('Number of Yields', summaryContext.yields);
        };

        return { getInputData, map, reduce, summarize };

    });
