/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(["N/record", "N/search", "N/ui/serverWidget"], (
  record,
  search,
  serverWidget
) => {
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
        title: "User Information Form",
      });

      form.addField({
        id: "custpage_jj_firstname",
        type: serverWidget.FieldType.TEXT,
        label: "First Name",
      });

      form.addField({
        id: "custpage_jj_lastname",
        type: serverWidget.FieldType.TEXT,
        label: "Last Name",
      });

      form.addField({
        id: "custpage_jj_email",
        type: serverWidget.FieldType.EMAIL,
        label: "Email",
      });

      form.addField({
        id: "custpage_jj_phone",
        type: serverWidget.FieldType.PHONE,
        label: "Phone",
      });

      // form.addField({
      //   id: "custpage_jj_dob",
      //   type: serverWidget.FieldType.DATE,
      //   label: "Date of Birth",
      // });

      form.addField({
        id: "custpage_jj_acc_salesrep",
        type: serverWidget.FieldType.SELECT,
        label: "Account Manager (Sales Rep)",
        source: "employee",
      });

      form.addSubmitButton({
        label: "Submit",
      });

      scriptContext.response.writePage(form);
    } else if (scriptContext.request.method === "POST") {
      let data = scriptContext.request.parameters;
      let firstName = data.custpage_jj_firstname;
      let lastName = data.custpage_jj_lastname;
      let email = data.custpage_jj_email;
      let phone = data.custpage_jj_phone;
      // let dob = data.custpage_jj_dob;
      let accSalesrep = data.custpage_jj_acc_salesrep;

      let customRecord = record.create({
        type: "customrecord_jj_user_info_colllection",
        isDynamic: true,
      });

      customRecord.setValue({
        fieldId: "custrecord_jj_first_name",
        value: firstName,
      });

      customRecord.setValue({
        fieldId: "custrecord_jj_last_name",
        value: lastName,
      });

      customRecord.setValue({
        fieldId: "custrecord_jj_phone",
        value: phone,
      });

      // customRecord.setValue({
      //   fieldId: "custrecord_jj_dob",
      //   value: dob,
      // });

      if (email) {
        customRecord.setValue({
          fieldId: "custrecord_jj_email",
          value: email,
        });

        let emailSearch = search
          .create({
            type: search.Type.CUSTOMER,
            filters: [["email", "is", email]],
          })
          .run()
          .getRange(0, 1);

        if (emailSearch.length > 0) {
          let emailSearchResult = record.load({
            type: "customer",
            id: emailSearch[0].id,
          });

          customRecord.setValue({
            fieldId: "custrecord_jj_accmanager_salesrep",
            value: emailSearchResult.getText({ fieldId: "salesrep" }),
          });
        }
      }
      let cusRecId = customRecord.save();
      scriptContext.response.write('User information submitted successfully');
    }
  };

  return { onRequest };
});
