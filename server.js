const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { v4 } = require('uuid');

const PROTO_PATH = './notes.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const notesProto = grpc.loadPackageDefinition(packageDefinition).note;

const notes = [
  { id: v4(), title: 'Note 1', content: 'Content 1' },
  { id: v4(), title: 'Note 2', content: 'Content 2' },
];

function main() {
  const server = new grpc.Server();
  server.addService(notesProto.NoteService.service, {
    list: (call, callback) => {
      callback(null, { notes });
    },
    insert: (call, callback) => {
      const noteForInsert = call.request;
      const note = {
        id: v4(),
        title: noteForInsert.title,
        content: noteForInsert.content,
      };
      notes.push(note);
      callback(null, note);
    },
  });
  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err != null) {
        return console.error(err);
      }
      console.log(`gRPC listening on ${port}`);
    }
  );
}

module.exports = main;
