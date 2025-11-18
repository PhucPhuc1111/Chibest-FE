"use client";

import { useState, useMemo } from "react";
import rulesData from "../../../public/data/rulesData.json";

interface Rule {
  id: string;
  category: string;
  items: RuleItem[];
}

interface RuleItem {
  id: string;
  title: string;
  sections: Section[];
}

interface Section {
  heading: string;
  subsections: SubSection[];
}

interface SubSection {
  title: string;
  content?: ContentItem[];
  items?: string[];
}

interface ContentItem {
  subTitle: string;
  description?: string;
  items?: string[];
}

export default function RulesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("general-info");
  const [activeItem, setActiveItem] = useState<string>("internal-regulations");

  // Xử lý dữ liệu từ JSON
  const rules: Rule[] = rulesData.rules;

  // Tìm category hiện tại
  const currentCategory = useMemo(
    () => rules.find((r) => r.id === activeCategory),
    [activeCategory, rules]
  );

  // Tìm item hiện tại
  const currentItem = useMemo(
    () => currentCategory?.items.find((item) => item.id === activeItem),
    [activeItem, currentCategory]
  );

  // Danh sách menu trái
  const menuItems = useMemo(() => {
    return rules.map((rule) => ({
      categoryId: rule.id,
      categoryName: rule.category,
      items: rule.items.map((item) => ({
        itemId: item.id,
        itemTitle: item.title,
      })),
    }));
  }, [rules]);

  return (
    <div className="min-h-screen  ">
      {/* Main Content */}
      <div className="mx-auto px-0 sm:px-4 lg:px-2 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Menu */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8 max-h-[calc(100vh-100px)] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Nội Dung</h2>
              <div className="space-y-4">
                {menuItems.map((category) => (
                  <div key={category.categoryId}>
                    {/* Category Title */}
                    <button
                      onClick={() => {
                        setActiveCategory(category.categoryId);
                        setActiveItem(category.items[0]?.itemId || "");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md font-semibold transition-colors ${
                        activeCategory === category.categoryId
                          ? "bg-amber-50 text-amber-700 border-l-4 border-amber-600"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {category.categoryName}
                    </button>

                    {/* Sub Items */}
                    {activeCategory === category.categoryId && (
                      <div className="ml-2 mt-2 space-y-1 border-l-2 border-gray-200">
                        {category.items.map((item) => (
                          <button
                            key={item.itemId}
                            onClick={() => setActiveItem(item.itemId)}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                              activeItem === item.itemId
                                ? "bg-amber-100 text-amber-800 font-semibold"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {item.itemTitle}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {currentItem ? (
              <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
                {currentItem.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className="space-y-6">
                    {/* Main Heading */}
                    <div className="border-b-2 border-amber-600 pb-4">
                      <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
                        {section.heading}
                      </h2>
                    </div>

                    {/* Subsections */}
                    <div className="space-y-6">
                      {section.subsections.map((subsection, subsecIdx) => (
                        <div key={subsecIdx} className="space-y-4">
                          {/* Subsection Title */}
                          <h3 className="text-xl font-bold text-gray-800">
                            {subsection.title}
                          </h3>

                          {/* Content Items (Description) */}
                          {subsection.content && subsection.content.length > 0 && (
                            <div className="space-y-4 ml-4">
                              {subsection.content.map((item, itemIdx) => (
                                <div key={itemIdx} className="space-y-2">
                                  {/* Sub Title */}
                                  <h4 className="font-semibold text-gray-700 flex items-start">
                                    <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-100 text-amber-600 rounded-full text-sm mr-3 flex-shrink-0 mt-0.5">
                                      {itemIdx + 1}
                                    </span>
                                    {item.subTitle}
                                  </h4>

                                  {/* Description */}
                                  {item.description && (
                                    <p className="text-gray-600 leading-relaxed ml-9">
                                      {item.description}
                                    </p>
                                  )}

                                  {/* Items List */}
                                  {item.items && item.items.length > 0 && (
                                    <ul className="space-y-2 ml-9">
                                      {item.items.map((listItem, listIdx) => (
                                        <li
                                          key={listIdx}
                                          className="flex items-start text-gray-600"
                                        >
                                          <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                          <span>{listItem}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* String Items List (for items array) */}
                          {subsection.items && subsection.items.length > 0 && (
                            <ul className="space-y-2 ml-4">
                              {subsection.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="flex items-start text-gray-600">
                                  <span className="inline-block w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-gray-500">Vui lòng chọn một mục từ menu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}