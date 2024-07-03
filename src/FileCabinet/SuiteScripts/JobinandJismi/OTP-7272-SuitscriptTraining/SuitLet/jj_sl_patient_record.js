/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 */
define(['N/record', 'N/ui/serverWidget'], (record, serverWidget) => {

  /**
   * Definition of the Suitelet trigger point.
   * @param {Object} scriptContext
   * @param {ServerRequest} scriptContext.request - Incoming request
   * @param {ServerResponse} scriptContext.response - Suitelet response
   * @since 2024.1
   */
  const onRequest = (scriptContext) => {
    if (scriptContext.request.method === 'GET') {
      // Handle GET request to display a form for patient registration
      let form = serverWidget.createForm({
        title: 'Patient Registration Form'
      });

      form.addField({
        id: 'custpage_jj_name',
        type: serverWidget.FieldType.TEXT,
        label: 'Name *'
      }).isMandatory = true;

      form.addField({
        id: 'custpage_jj_age',
        type: serverWidget.FieldType.INTEGER,
        label: 'Age *'
      }).isMandatory = true;

      let sexField = form.addField({
        id: 'custpage_jj_sex',
        type: serverWidget.FieldType.SELECT,
        label: 'Sex *'
      });
      sexField.addSelectOption({
        value: '',
        text: ''
      });
      sexField.addSelectOption({
        value: 'M',
        text: 'Male'
      });
      sexField.addSelectOption({
        value: 'F',
        text: 'Female'
      });
      sexField.addSelectOption({
        value: 'O',
        text: 'Other'
      });
      sexField.isMandatory = true;

      form.addField({
        id: 'custpage_jj_address',
        type: serverWidget.FieldType.TEXTAREA,
        label: 'Address *'
      }).isMandatory = true;

      form.addSubmitButton({
        label: 'Submit'
      });

      scriptContext.response.writePage(form);

    } else if (scriptContext.request.method === 'POST') {
      // Handle POST request to process form submission
      let data = scriptContext.request.parameters;
      let name = data.custpage_jj_name;
      let age = parseInt(data.custpage_jj_age, 10);
      let sex = data.custpage_jj_sex;
      let address = data.custpage_jj_address;

      // Validate mandatory fields
      if (!name || !age || !sex || !address) {
        scriptContext.response.statusCode = 400; // Bad Request
        scriptContext.response.write('Please provide all mandatory fields: Name, Age, Sex, Address');
        return;
      }

      let customRecord = record.create({
        type: 'customrecord_jj_patient_record',
        isDynamic: true,
      });
      customRecord.setValue({
        fieldId: 'name',
        value: name,
      });
      customRecord.setValue({
        fieldId: 'custrecord_jj_age',
        value: age,
      });
      customRecord.setValue({
        fieldId: 'custrecord_jj_sex',
        value: sex,
      });
      customRecord.setValue({
        fieldId: 'custrecord_jj_address',
        value: address,
      });

      // Save the record
      let recordId;
      try {
        recordId = customRecord.save();
        scriptContext.response.write(recordId);
      } catch (e) {
        scriptContext.response.statusCode = 500; // Internal Server Error
        scriptContext.response.write(`Error creating patient record: ${e.message}`);
      }
    } else {
      scriptContext.response.statusCode = 405; // Method Not Allowed
      scriptContext.response.write('Method Not Allowed');
    }
  };

  return {
    onRequest
  };
});
