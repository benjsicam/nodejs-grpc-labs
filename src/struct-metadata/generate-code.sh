# Install grpc-tools globally via npm i -g grpc-tools

cd ./protos
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../src/codegen/ --grpc_out=grpc_js:../src/codegen --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./sample.proto
cd -