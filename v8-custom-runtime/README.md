```cpp
/* ... */
void Alert(const v8::FunctionCallbackInfo<v8::Value>& args);
/* ... */
v8::Local<v8::Context> CreateShellContext(v8::Isolate* isolate) {
  /* ... */
  // Bind 'alert' function
  global->Set(
    v8::String::NewFromUtf8(isolate, "alert", v8::NewStringType::kNormal.ToLocalChecked(),
    v8::FunctionTemplate::New(isolate, Alert));
  /* ... */
}
/* ... */
// Implementation of JavaScript `alert` function
void Alert(const v8::FunctionCallbackInfo<v8::Value>& args) {
  printf("YOU ARE STUPID\n");
  fflush(stdout);
}
```
