class Dependencies{
    dependencies: string = '';
    dependenciesOf: {} = {};

    for(module: string) {
        let dependencies  = this.dependenciesOf[module] ?? "";
        let result: string = dependencies;
        while(this.dependenciesOf[dependencies]) {
            result += " " + this.dependenciesOf[dependencies];
            dependencies = this.dependenciesOf[dependencies];
        }

        return result;
    }

    to(module: string) {
        this.dependenciesOf[module] = this.dependencies;
    }

    add(dependencies: string) {
        this.dependencies = dependencies;
        return this;
    }
}

describe("unit tests", () => {
    let dependencies: Dependencies;
    beforeEach(() => { dependencies = new Dependencies(); })

    describe("when a module is not initialised", () => {
        it("should have no dependencies", () => {
            expect(dependencies.for("Z")).toEqual("")
        });
    })

    describe("when a module is initialised with a single dependency", () => {
        it("should have a single dependency", () => {
            dependencies.add("B").to("A");
            expect(dependencies.for("A")).toEqual("B");
        });
    })

    describe("when 2 modules are initialised with one dependency each", () => {
        it("should have a single dependency on each", () => {
            dependencies.add("B").to("A");
            dependencies.add("D").to("C");

            expect(dependencies.for("A")).toEqual("B");
            expect(dependencies.for("C")).toEqual("D");
        });
    });

    describe("when modules dependency has a dependency ", () => {
        it("that module should have both of those dependencies", () => {
            dependencies.add("B").to("A");
            dependencies.add("C").to("B");

            expect(dependencies.for("A")).toEqual("B C");
            expect(dependencies.for("B")).toEqual("C");
        });
    });

    describe("when module's dependency has a dependency that has a dependency", () => {
        it("that module should have all three of those dependencies", () => {
            dependencies.add("B").to("A");
            dependencies.add("C").to("B");
            dependencies.add("D").to("C");

            expect(dependencies.for("A")).toEqual("B C D");
            expect(dependencies.for("B")).toEqual("C D");
            expect(dependencies.for("C")).toEqual("D");
        });
    });

    describe("when module in the dependency chain has two dependencies", () => {
        it("those dependencies children should be looked up", () => {
            dependencies.add("B").to("A");
            dependencies.add("C D").to("B");
            dependencies.add("E").to("D");

            expect(dependencies.for("A")).toEqual("B C D E");
            expect(dependencies.for("B")).toEqual("C D E");
            expect(dependencies.for("D")).toEqual("E");
        });
    });

});

xdescribe("acceptance tests", () => {
    describe("When we request the dependencies", () => {
        it("should get the full list of transitive dependencies", () => {
            let dependencies: Dependencies = new Dependencies();

            dependencies.add("B C").to("A");
            dependencies.add("C E").to("B");
            dependencies.add("G").to("C");
            dependencies.add("A F").to("D");
            dependencies.add("F").to("E");
            dependencies.add("H").to("F");

            expect(dependencies.for("A")).toEqual("B C E F G H");
            expect(dependencies.for("B")).toEqual("C E F G H");
            expect(dependencies.for("C")).toEqual("G");
            expect(dependencies.for("D")).toEqual("A B C E F G H");
            expect(dependencies.for("E")).toEqual("F H");
            expect(dependencies.for("F")).toEqual("H");
        });
    });
});

