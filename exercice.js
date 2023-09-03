const members = require("./members");

function membersBilledAndDependents(members) {
  //1)Determine which members should be billed
  const listOfMembersToBeBilled = [];

  //2) Identify the number and/or names of dependent children
  const dependentChildren = new Map();

  //3) Detect circular references
  const circularReferences = [];

  //Follow visited members
  let visitedMembers = [];

  function checkLink(member, ids, names) {
    if (!visitedMembers.includes(member.id)) {
      visitedMembers = [...visitedMembers, member.id];
      const visitedIds = [...ids, member.id];
      const visitedNames = [...names, member.name];

      if (member.linkId === null) {
        listOfMembersToBeBilled.push(member.name);
      } else {
        const linkedMember = members.find(
          (element) => element.id === member.linkId
        );
        if (linkedMember) {
          const dependents = dependentChildren.get(linkedMember.name) || [];
          dependentChildren.set(linkedMember.name, [
            ...dependents,
            member.name,
          ]);
          if (visitedIds.includes(linkedMember.id)) {
            circularReferences.push([...visitedNames, linkedMember.name]);
            return;
          } else {
            checkLink(linkedMember, visitedIds, visitedNames);
          }
        }
      }
    } else return;
  }

  members.forEach((member) => {
    checkLink(member, [], []);
  });

  return [listOfMembersToBeBilled, dependentChildren, circularReferences];
}

const [listOfMembersToBeBilled, dependentChildren, circularReferences] =
  membersBilledAndDependents(members);

//Determine which members should be billed
console.log(
  `1) List of members to be billed: ${listOfMembersToBeBilled.join(", ")}.`
);

//Identify the number and/or names of dependent children
console.log("2) List of dependent children:");
for (let [key, value] of dependentChildren) {
  console.log(
    `Parent ${key} has ${value.length} ${
      value.length == 1 ? "child" : "children"
    }: ${value.join(", ")}.`
  );
}

//Detect circular references
console.log("3) Circular references detected:");
for (let circle of circularReferences) {
  console.log(`${circle.join(" linked to ")}.`);
}
