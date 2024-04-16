const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './notes.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const notesProto = grpc.loadPackageDefinition(packageDefinition).note;

function main() {
  const client = new notesProto.NoteService(
    'localhost:50051',
    grpc.credentials.createInsecure()
  );
  client.list({}, (err, response) => {
    if (err) {
      console.error('client list error: ', err);
    } else {
      console.log('client list response: ', response.notes);
    }
  });
  client.insert({ title: 'Note 3', content: 'Content 3' }, (err, response) => {
    if (err) {
      console.error('client insert error: ', err);
    } else {
      console.log('client insert response: ', response);
    }
  });
  client.list({}, (err, response) => {
    if (err) {
      console.error('client list error: ', err);
    } else {
      console.log('client list response: ', response.notes);
    }
  });
}

module.exports = main;
