/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/serverWidget"], /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */ (record, serverWidget) => {
  /**
   * Defines the Suitelet script trigger point.
   * @param {Object} scriptContext
   * @param {ServerRequest} scriptContext.request - Incoming request
   * @param {ServerResponse} scriptContext.response - Suitelet response
   * @since 2015.2
   */
  const onRequest = (scriptContext) => {
    if (scriptContext.request.method === "GET") {
      let form = serverWidget.createForm({
        title: "Registration Form",
      });
      let fieldGroup = form.addFieldGroup({
        id: "_jj_fieldgroup",
        label: "Registration Information",
      });

      let Name = form.addField({
        id: "_jj_name",
        type: serverWidget.FieldType.TEXT,
        label: "Name",
        container: "_jj_fieldgroup",
      });

      let Age = form.addField({
        id: "_jj_age",
        type: serverWidget.FieldType.INTEGER,
        label: "Age",
        container: "_jj_fieldgroup",
      });

      let phone = form.addField({
        id: "_jj_phone",
        type: serverWidget.FieldType.PHONE,
        label: "Phone",
        container: "_jj_fieldgroup",
      });

      let email = form.addField({
        id: "_jj_email",
        type: serverWidget.FieldType.EMAIL,
        label: "Email",
        container: "_jj_fieldgroup",
      });

      let fathersName = form.addField({
        id: "_jj_fathersname",
        type: serverWidget.FieldType.TEXT,
        label: "Father's Name",
        container: "_jj_fieldgroup",
      });

      let address = form.addField({
        id: "_jj_address",
        type: serverWidget.FieldType.TEXT,
        label: "Address",
        container: "_jj_fieldgroup",
      });

      form.addSubmitButton({
        label: "Submit",
      });

      scriptContext.response.writePage(form);
    }
  };
  return { onRequest };
});
