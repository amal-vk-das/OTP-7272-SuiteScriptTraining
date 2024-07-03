/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
    /**
     * @param{record} record
     * @param{search} search
     */
    function(record, search) {
    
        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {

        }
    
        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {

        }
    
        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {
            let currentRecord = scriptContext.currentRecord;
            let sublistId = scriptContext.sublistId;
            let sublistFieldId = scriptContext.fieldId;
    
            if (sublistFieldId === "item") {
                let itemId = currentRecord.getCurrentSublistValue({
                    sublistId: sublistId,
                    fieldId: sublistFieldId,
                });
    
                console.log(itemId);
                try {
                    let itemRecord = record.load({
                        type: record.Type.INVENTORY_ITEM,
                        id: itemId,
                        isDynamic: true,
                    });
    
                    let lineCount = itemRecord.getLineCount({
                        sublistId: "locations"
                    });
    
                    let totalAvailableQuantity = 0;
    
                    for (let i = 0; i < lineCount; i++) {
                        let quantityAvailable = itemRecord.getSublistValue({
                            sublistId: "locations",
                            fieldId: 'quantityavailable',
                            line: i
                        });
                        let numericValue = parseFloat(quantityAvailable);
                        if (!isNaN(numericValue)) {
                            totalAvailableQuantity += numericValue;
                        }
                    }
                    console.log(totalAvailableQuantity);
    
                    currentRecord.setCurrentSublistValue({
                        sublistId: sublistId,
                        fieldId: "custcol_jj_itemavailability",
                        value: totalAvailableQuantity,
                    });
    
                } catch (e) {
                    console.log(e);
                }
            }
        }
    
        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
  
        }
    
        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
    
        }
    
        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {
      
        }
    
        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {
     
        }
    
        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {

        }
    
        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {
  
        }
    
        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {
            var currentRecord = scriptContext.currentRecord;
    
            let itemLineCount = currentRecord.getLineCount({
                sublistId: "item"
            });
    
            for (let i = 0; i < itemLineCount; i++) {
                let quantityAvailableValue = currentRecord.getSublistValue({
                    sublistId: "item",
                    fieldId: "custcol_jj_itemavailability",
                    line: i
                });
    
                console.log(quantityAvailableValue);
    
                let quantity = currentRecord.getSublistValue({
                    sublistId: "item",
                    fieldId: "quantity",
                    line: i
                });
    
                console.log(quantity);
    
                if (quantityAvailableValue < quantity) {
                    currentRecord.setValue({
                        fieldId: "custbody_jj_item_availability_status",
                        value: "BackOrdered",
                        ignoreFieldChange: true
                    });
                    return false;
                } else if (quantityAvailableValue >= quantity) {
                    currentRecord.setValue({
                        fieldId: "custbody_jj_item_availability_status",
                        value: "Available",
                        ignoreFieldChange: true
                    });
                }
            }
            return true;
        }
    
        return {
            // pageInit: pageInit,
            // fieldChanged: fieldChanged,
            postSourcing: postSourcing,
            // sublistChanged: sublistChanged,
            // lineInit: lineInit,
            // validateField: validateField,
            // validateLine: validateLine,
            // validateInsert: validateInsert,
            // validateDelete: validateDelete,
            saveRecord: saveRecord
        };
    });
    