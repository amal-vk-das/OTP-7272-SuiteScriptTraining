/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(["N/record"], /**
 * @param{record} record
 */ function (record) {
  /**
   * Function to be executed after page is initialized.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
   *
   * @since 2015.2
   */
  function pageInit(scriptContext) {}

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
  function fieldChanged(scriptContext) {}

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
    let sublistfieldId = scriptContext.fieldId;

    if (sublistfieldId === "item") {
      let itemId = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: sublistfieldId,
      });
      try {
        let itemRecord = record.load({
          type: record.Type.INVENTORY_ITEM,
          id: itemId,
          isDynamic: true,
        });

        let length = itemRecord.getValue("custitem_jj_length");
        let breadth = itemRecord.getValue("custitem_jj_breadth");
        let height = itemRecord.getValue("custitem_jj_height");

        let containerBoxValue = length * breadth * height;

        currentRecord.setCurrentSublistValue({
          sublistId: sublistId,
          fieldId: "custcol_jj_container_box",
          value: containerBoxValue,
        });

        if (containerBoxValue !== 0) {
          let rate = currentRecord.getCurrentSublistValue({
            sublistId: sublistId,
            fieldId: "rate",
          });

          let newAmount = rate * containerBoxValue;

          currentRecord.setCurrentSublistValue({
            sublistId: sublistId,
            fieldId: "amount",
            value: newAmount,
          });
        }
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
  function sublistChanged(scriptContext) {}

  /**
   * Function to be executed after line is selected.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @param {string} scriptContext.sublistId - Sublist name
   *
   * @since 2015.2
   */
  function lineInit(scriptContext) {}

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
  function validateField(scriptContext) {}

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
    let currentRecord = scriptContext.currentRecord;
    let sublistId = scriptContext.sublistId;

    let amount = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: "amount",
      });
    let rate = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: "rate",
      });
      let valueOfContainerBox = currentRecord.getCurrentSublistValue({
        sublistId: sublistId,
        fieldId: "custcol_jj_container_box",
      });

      if (amount == rate * valueOfContainerBox || amount == rate) {
        return true;
      } else {
        alert("The amount must be equal to the rate multiplied by the value of the container box.");
        return false;
      }

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
  function validateInsert(scriptContext) {}

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
  function validateDelete(scriptContext) {}

  /**
   * Validation function to be executed when record is saved.
   *
   * @param {Object} scriptContext
   * @param {Record} scriptContext.currentRecord - Current form record
   * @returns {boolean} Return true if record is valid
   *
   * @since 2015.2
   */
  function saveRecord(scriptContext) {}

  return {
    // pageInit: pageInit,
    // fieldChanged: fieldChanged,
    postSourcing: postSourcing,
    // sublistChanged: sublistChanged,
    // lineInit: lineInit,
    // validateField: validateField,
    validateLine: validateLine,
    // validateInsert: validateInsert,
    // validateDelete: validateDelete,
    // saveRecord: saveRecord
  };
});
