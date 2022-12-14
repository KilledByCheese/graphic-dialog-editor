import Ajv from "ajv";

const ajv = new Ajv();
const schema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    "@id": {
      type: "string",
    },
    "@type": {
      const: "Dialog",
    },
    states: {
      type: "array",
      items: {
        type: "object",
        properties: {
          state: {
            type: "string",
          },
          response: {
            type: "array",
            minItems: 1,
            items: {
              type: "object",
              properties: {
                recognizes: {
                  type: "array",
                  items: [
                    {
                      type: "string",
                    },
                  ],
                },
                goto: {
                  type: "string",
                },
              },
              required: ["goto"],
            },
          },
        },
        required: ["state"],
      },
    },
  },
  required: ["@type", "states"],
  additionalProperties: false,
};

const validate = ajv.compile(schema);
export default function isValidDialog(dialog: any) {
  let valid = validate(dialog);
  if (!valid) console.log(validate.errors);
  return valid;
}
