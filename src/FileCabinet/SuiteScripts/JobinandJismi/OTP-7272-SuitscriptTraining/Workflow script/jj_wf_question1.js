/**
 * @NApiVersion 2.1
 * @NScriptType WorkflowActionScript
 */
define(['N/record', 'N/redirect', 'N/runtime', 'N/search', 'N/workflow'],
    /**
 * @param{record} record
 * @param{redirect} redirect
 * @param{runtime} runtime
 * @param{search} search
 * @param{workflow} workflow
 */
    (record, redirect, runtime, search, workflow) => {
        /**
         * Defines the WorkflowAction script trigger point.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.workflowId - Internal ID of workflow which triggered this action
         * @param {string} scriptContext.type - Event type
         * @param {Form} scriptContext.form - Current form that the script uses to interact with the record
         * @since 2016.1
         */
        const onAction = (scriptContext) => {
            let taskRecord = scriptContext.newRecord
 
            let rec =record.create({
                type: 'customrecord_jj_customrecordquestionone',
                isDynamic: true,
 
            })

            rec.setValue('custrecord_jj_custname',taskRecord.getValue('title'))
            rec.setValue('custrecord_jj_test',"Test")
 
            let recId =rec.save({
                ignoreMandatoryFields: true
            })
           
            return recId
        }
 
        return {onAction};
    });