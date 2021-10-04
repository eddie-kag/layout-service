import http from "k6/http";
import { check, group, fail } from "k6";
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.0.0/index.js";

const BASE_URL = __ENV["BASE_URL"];

export const options = {
  thresholds: {
    checks: ["rate>=1"],
  },
};

export default function () {
  group("create room", function () {
    group("bad request", function () {
      test_createRoomWithInvalidPayload_fail();
    });

    group("conflict", function () {
      test_createRoomDuplicate_fail();
    });

    group("success", function () {
      test_createRoom_success();
    });
  });

  group("get room", function () {
    group("not found", function () {
      test_getRoomNotFound_fail();
    });

    group("success", function () {
      test_getRoom_success();
    });
  });

  group("create object", function () {
    group("bad request", function () {
      test_createObjectWithInvalidPayload_fail();
      test_createObjectIntersects_fail();
      test_createObjectWithInvalidCoordinates_fail();
      test_createObjectWithoutRoom_fail();
    });

    group("conflict", function () {
      test_createObjectDuplicate_fail();
    });

    group("success", function () {
      test_createObject_success();
    });
  });

  group("get object", function () {
    group("not found", function () {
      test_getObjectNotFound_fail();
    });

    group("success", function () {
      test_getObject_success();
    });
  });
}

const test_createRoomWithInvalidPayload_fail = () => {
  const response = createRoom(undefined, randomId());

  check(response, {
    "invalid payload returns 400": (r) => r.status === 400,
  });
};

const test_createRoomDuplicate_fail = () => {
  const id = randomId();

  const response1 = createRoom(id, `${id}_1`);
  if (!response1.status === 201) {
    throw new Error("Dependent operation failed.");
  }

  const response2 = createRoom(id, `${id}_2`);

  check(response2, {
    "duplicate record returns 409": (r) => r.status === 409,
  });
};

const test_createRoom_success = () => {
  const id = randomId();

  const response = createRoom(id, id);

  check(response, {
    "create room response returns 201": (r) => r.status === 201,
    "create room response contains id, name, createAt and updatedAt": (r) => {
      const jsonRes = r.json();
      return (
        jsonRes.id && jsonRes.name && jsonRes.createdAt && jsonRes.updatedAt
      );
    },
  });
};

const test_getRoomNotFound_fail = () => {
  const id = randomId();

  const response = getRoom(id);

  check(response, {
    "request for missing room returns 404": (r) => r.status === 404,
  });
};

const test_getRoom_success = () => {
  const id = randomId();

  createRoom(id, id);

  const response = getRoom(id);

  check(response, {
    "get room response returns 200": (r) => r.status === 200,
    "get room response contains id, name, createAt and updatedAt": (r) => {
      const jsonRes = r.json();
      return (
        jsonRes.id && jsonRes.name && jsonRes.createdAt && jsonRes.updatedAt
      );
    },
  });
};

const test_createObjectWithInvalidPayload_fail = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id = randomId();
  const response = createObject(undefined, id, roomId, VALID_COORDINATES);

  check(response, {
    "invalid payload returns 400": (r) => r.status === 400,
  });
};

const test_createObjectWithInvalidCoordinates_fail = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id = randomId();

  const coordinates = [
    [1, 5],
    [2, 5],
    [2, 4],
    [1, 4],
    [1, 6],
  ];

  const response = createObject(undefined, id, roomId, coordinates);

  check(response, {
    "invalid coordinates returns 400": (r) => r.status === 400,
  });
};

const test_createObjectIntersects_fail = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id1 = randomId();
  const response1 = createObject(id1, `${id1}_1`, roomId, VALID_COORDINATES);
  if (response1.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id2 = randomId();
  const response2 = createObject(id2, `${id2}_2`, roomId, VALID_COORDINATES);

  check(response2, {
    "object intersect returns 400": (r) => r.status === 400,
  });
};

const test_createObjectDuplicate_fail = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id1 = randomId();
  const coordinates1 = [
    [1, 1],
    [2, 1],
    [2, 2],
    [1, 2],
    [1, 1],
  ];

  const response1 = createObject(id1, `${id1}_1`, roomId, coordinates1);
  if (response1.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id2 = randomId();
  const coordinates2 = [
    [2, 2],
    [4, 2],
    [4, 4],
    [2, 4],
    [2, 2],
  ];

  const response2 = createObject(id2, `${id2}_2`, roomId, coordinates2);

  check(response2, {
    "object intersect returns 400": (r) => r.status === 400,
  });
};

const test_createObjectWithoutRoom_fail = () => {
  const roomId = randomId();

  const id = randomId();

  const response = createObject(id, id, roomId, VALID_COORDINATES);
  console.log(response.status, response.body);

  check(response, {
    "object with missing room returns 400": (r) => r.status === 400,
  });
};

const test_createObject_success = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id = randomId();

  const response = createObject(id, id, roomId, VALID_COORDINATES);

  check(response, {
    "create object response returns 201": (r) => r.status === 201,
    "create object response contains id, name, roomId, coordinates, createAt and updatedAt":
      (r) => {
        const jsonRes = r.json();
        return (
          jsonRes.id &&
          jsonRes.name &&
          jsonRes.roomId &&
          jsonRes.coordinates &&
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
    "missing object returns 404": (r) => r.status === 404,
  });
};

const test_getObject_success = () => {
  const roomId = randomId();
  const roomRes = createRoom(roomId, roomId);
  if (roomRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const id = randomId();

  const createRes = createObject(id, id, roomId, VALID_COORDINATES);
  if (createRes.status !== 201) {
    throw new Error("Dependent operation failed.");
  }

  const response = getObject(id);
  console.log(response.status, response.body);

  check(response, {
    "get object response returns 200": (r) => r.status === 200,
    "get object response contains id, name, roomId, coordinates, createdAt and updatedAt":
      (r) => {
        const jsonRes = r.json();
        return (
          jsonRes.id &&
          jsonRes.name &&
          jsonRes.roomId &&
          jsonRes.coordinates &&
          jsonRes.createdAt &&
          jsonRes.updatedAt
        );
      },
  });
};

const HEADERS = {
  headers: { "Content-Type": "application/json" },
};

const createRoom = (id, name) => {
  const url = `${BASE_URL}/rooms`;

  return http.post(url, JSON.stringify({ id, name }), HEADERS);
};

const getRoom = (id) => {
  const url = `${BASE_URL}/rooms/${id}`;

  return http.get(url);
};

const createObject = (id, name, roomId, coordinates) => {
  const url = `${BASE_URL}/objects`;

  return http.post(
    url,
    JSON.stringify({ id, name, roomId, coordinates }),
    HEADERS
  );
};

const getObject = (id) => {
  const url = `${BASE_URL}/objects/${id}`;

  return http.get(url);
};

const getObjects = (roomId) => {
  const url = `${BASE_URL}/objects?roomId=${roomId}`;

  return http.get(url);
};

const randomId = () => {
  return uuidv4();
};

const VALID_COORDINATES = [
  [1, 5],
  [2, 5],
  [2, 4],
  [1, 4],
  [1, 5],
];
