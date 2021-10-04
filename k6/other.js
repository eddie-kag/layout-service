const test_createObjectWithInvalidPayload_fail = () => {
  const response = createObject(undefined, randomId());

  check(response, {
    "returns 400": (r) => r.status === 400,
  });
};

const test_createObjectDuplicate_fail = () => {
  const id = randomId();

  createObject(id, `${id}_1`);
  const response2 = createObject(id, `${id}_2`);

  check(response2, {
    "returns 409": (r) => r.status === 409,
  });
};

const test_createObject_success = () => {
  const id = randomId();

  const response = createObject(id, id);

  check(response, {
    "returns 201": (r) => r.status === 201,
    "contains id, name, roomId, createAt and updatedAt": (r) => {
      const jsonRes = r.json();
      return (
        jsonRes.id &&
        jsonRes.name &&
        jsonRes.roomId &&
        jsonRes.createdAt &&
        jsonRes.updatedAt
      );
    },
  });
};

const test_getObjectNotFound_fail = () => {
  const id = randomId();

  const response = getObject(id);

  check(response, {
    "returns 404": (r) => r.status === 404,
  });
};

const test_getObject_success = () => {
  const id = randomId();

  createObject(id, id);

  const response = getObject(id);

  check(response, {
    "returns 200": (r) => r.status === 200,
    "contains id, name, roomId, createAt and updatedAt": (r) => {
      const jsonRes = r.json();
      return (
        jsonRes.id &&
        jsonRes.name &&
        jsonRes.roomId &&
        jsonRes.createdAt &&
        jsonRes.updatedAt
      );
    },
  });
};
