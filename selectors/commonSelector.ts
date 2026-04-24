// {
//   "subAreaMenuSelectors": {
//     "DynamicSubAreaMenuSelector": "//nav[@aria-label='Global']//span[normalize-space()='{0}']",
//     "DynamicAppLauncherButton": "//div[@role='navigation' and @aria-label='App']//button[@title='{0}']"
//   }
// }

export const selectors = {
  subAreaMenuSelectors: {
    DynamicSubAreaMenuSelector: "//nav[@aria-label='Global']//span[normalize-space()='{0}']",
    DynamicAppLauncherButton: "//div[@role='navigation' and @aria-label='App']//button[@title='{0}']"

  },

  viewSelectors: {
        ViewSelector: "//button[contains(@title,'Select a List View')]",
        ViewName: "//lightning-base-combobox-item//span[@class='slds-media__figure slds-listbox__option-icon']/following-sibling::span[normalize-space()='{0}']",
    },
  gridSelectors: {
        ColumnHeader: "//th[@aria-label='{0}']//span[contains(@class,'slds-truncate')]",
  },    
  dynamicSelector: {      
        DynamicButtonByTitle: "//button[@title='{0}']",   
        DynamicDropdownByLabel: "//button[@role='combobox' and contains(@aria-label,'{0}')]",
        DynamicRadioOption: "//label[.//span[normalize-space()='{0}']]",
        DynamicButtonInContainer: "//lightning-button//button[normalize-space()='{0}']",
        DynamicDropdownOption: "//lightning-base-combobox-item//span[@title='{0}']",
    }
};