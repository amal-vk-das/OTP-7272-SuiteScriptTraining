/**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(["N/record"], (record) => {
  /**
   * Defines the Mass Update script trigger point.
   * @param {Object} params
   * @param {string} params.type - Record type of the record being processed
   * @param {number|string} params.id - ID of the record being processed
   * @since 2016.1
   */
  const each = (params) => {
    record.submitFields({
      type: params.type,
      id: params.id,
      values: {
        custrecord_jj_marital_status: 1,
      },
    });
  };

  return { each };
});
