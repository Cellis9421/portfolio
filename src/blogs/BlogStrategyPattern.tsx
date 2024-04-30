import React from "react";

function BlogStrategyPattern() {
  return (
    <div>
      <h1>Strategy Pattern</h1>
      <p>
        The Strategy Pattern is a behavioral design pattern that enables
        selecting an algorithm at runtime. It defines a family of algorithms,
        encapsulates each algorithm, and makes the algorithms interchangeable
        within that family.
      </p>
      <p>
        The Strategy Pattern allows the algorithm to vary independently from the
        context that uses it. This pattern is useful when you have multiple
        algorithms that can be used interchangeably. It helps to avoid
        conditional statements and switch-case statements, making the code more
        maintainable and easier to understand.
      </p>
      <p>The Strategy Pattern consists of three main components:</p>
      <ul>
        <li>
          <strong>Context:</strong> The class that uses the strategy. It has a
          reference to the strategy and delegates the work to the strategy.
        </li>
        <li>
          <strong>Strategy:</strong> The interface that defines the algorithm.
          It is implemented by concrete strategies.
        </li>
        <li>
          <strong>Concrete Strategy:</strong> The class that implements the
          strategy interface. It contains the algorithm that is used by the
          context.
        </li>
      </ul>
      <p>Here is an example of the Strategy Pattern in TypeScript:</p>
      <pre>
        <code>
          {`interface IStrategy {
  execute(): void;
}`}

          {`class Context {
  private strategy: IStrategy;

  constructor(strategy: IStrategy) {
    this.strategy = strategy;
  }

  public setStrategy(strategy: IStrategy) {
    this.strategy = strategy;
  }

  public executeStrategy() {
    this.strategy.execute();
  }
}`}

          {`class ConcreteStrategyA implements IStrategy {
  public execute() {
    console.log("Executing strategy A");
  }
}`}

          {`class ConcreteStrategyB implements IStrategy {
  public execute() {
    console.log("Executing strategy B");
  }
}`}

          {`const context = new Context(new ConcreteStrategyA());`}
          {`context.executeStrategy(); // Output: Executing strategy A`}
          {`context.setStrategy(new ConcreteStrategyB());`}
          {`context.executeStrategy(); // Output: Executing strategy B`}
        </code>
      </pre>
      <p>
        In this example, we have a <code>Context</code> class that uses a{" "}
        <code>Strategy</code> interface. The <code>Context</code> class
        delegates the work to the strategy. We have two concrete strategies:{" "}
        <code>ConcreteStrategyA</code> and <code>ConcreteStrategyB</code>. The{" "}
        <code>Context</code> class can switch between these strategies at
        runtime.
      </p>
    </div>
  );
}

export default BlogStrategyPattern;
