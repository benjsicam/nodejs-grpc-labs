# Install grpc-tools globally via npm i -g grpc-tools

grpc_tools_node_protoc --js_out=import_style=commonjs,binary:./codegen/ --grpc_out=grpc_js:./codegen --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./sample.proto