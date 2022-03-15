import React, { ErrorInfo } from "react";

export class ErrorBoundary extends React.Component {
  private error: Error;
  private errorInfo: ErrorInfo;
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.error = error;
    this.errorInfo = errorInfo;
  }

  render() {
    if (this.error) return JSON.stringify(this.errorInfo);
    return <div>{this.props.children}</div>;
  }
}
