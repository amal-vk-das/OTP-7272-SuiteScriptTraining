/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/ui/serverWidget","N/search"], /**
 * @param{record} record
 * @param{serverWidget} serverWidget
 */ (record, serverWidget,search) => {
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
        title: "Customer Information Form",
      });
      let fieldGroup = form.addFieldGroup({
        id: "_jj_customerinformation",
        label: "Customer Information",
      });

      let Name = form.addField({
        id: "_jj_name",
        type: serverWidget.FieldType.TEXT,
        label: "Name",
        container: "_jj_customerinformation",
      });

      let email = form.addField({
        id: "_jj_email",
        type: serverWidget.FieldType.EMAIL,
        label: "Email",
        container: "_jj_customerinformation",
      });

      let phone = form.addField({
        id: "_jj_phone",
        type: serverWidget.FieldType.PHONE,
        label: "Phone",
        container: "_jj_customerinformation",
      });

      let salesRep = form.addField({
        id: "_jj_salesrep",
        type: serverWidget.FieldType.SELECT,
        label: "Sales Rep",
        container: "_jj_customerinformation",
      });

      let salesRepSearch = search.create({
        type: search.Type.EMPLOYEE,
        filters: [
          ["isinactive", "is", "F"],
          "AND",
          ["issalesrep", "is", "T"],
        ],
        columns: ["internalid", "entityid"],
      });
      let salesRepResults = salesRepSearch.run().getRange(0, 1000);
      let salesRepOptions = [];
      for (let i = 0; i < salesRepResults.length; i++) {
        let salesRepResult = salesRepResults[i];
        let salesRepOption = {
          value: salesRepResult.getValue("internalid"),
          text: salesRepResult.getValue("entityid"),
        };
        salesRepOptions.push(salesRepOption);
      }

      let subsidiary = form.addField({
        id: "_jj_subsidiary",
        type: serverWidget.FieldType.SELECT,
        label: "Subsidiary",
        source: "subsidiary",
        container: "_jj_customerinformation",
      });

      form.addSubmitButton({
        label: "Submit",
      });

      scriptContext.response.writePage(form);
    } else {
      let customerName = scriptContext.request.parameters._jj_name;
      let emailField = scriptContext.request.parameters._jj_email;
      let phone = scriptContext.request.parameters._jj_phone;
      let salesRep = scriptContext.request.parameters._jj_salesrep;
      let subsidiary = scriptContext.request.parameters._jj_subsidiary;

      let newCusRec = record.create({
        type: record.Type.CUSTOMER,
        isDynamic: true,
      });

      newCusRec.setValue({
        fieldId: "companyname",
        value: customerName,
      });
      newCusRec.setValue({
        fieldId: "email",
        value: emailField,
      });
      newCusRec.setValue({
        fieldId: "phone",
        value: phone,
      });
      newCusRec.setValue({
        fieldId: "salesrep",
        value: salesRep,
      });
      newCusRec.setValue({
        fieldId: "subsidiary",
        value: salesRep,
      });

      scriptContext.response.write(
        "You have entered:" +
          "<br/>  Name: " +
          customerName +
          "<br/>  Email: " +
          emailField +
          "<br/>  Phone: " +
          phone +
          "<br/> SalesRep " +
          salesRep +
          "<br/>  Subsidiary: " +
          subsidiary
      );
    }
  };

  return { onRequest };
});
