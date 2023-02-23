import { mount } from "@vue/test-utils";
import Header from "@/components/Header.vue";

describe("Header component unit test(s): ", () => {
  it("renders props when passed", () => {
    const title = "Wichita Flag Football Association";
    const wrapper = mount(Header, {
      props: { title },
    });
    expect(wrapper.text()).toMatch(title);
  });

  // needs more testing
  // test("Renders the list", () => {
  //   const wrapper = mount(UserList);
  //   const name = "Anna Strong";
  //   const user = wrapper.get('[data-user="user"]');
  //   expect(user.text()).toContain(name);
  //   expect(wrapper.findAll('[data-user="user"]')).toHaveLength(2);
  // });

  // test("creates a user", async () => {
  //   const wrapper = mount(UserList);
  //   const newName = "John Doe";
  //   await wrapper.get('[id="new-user"]').setValue(newName);
  //   await wrapper.get('[id="form"]').trigger("submit");
  //   expect(wrapper.findAll('[data-user="user"]')).toHaveLength(3);
  // });
});