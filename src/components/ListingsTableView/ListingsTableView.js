import React from "react";
import { useState, useEffect } from "react";
import "./ListingsTableView.css";
import { MdDelete } from "react-icons/md";
import { TbEdit } from "react-icons/tb";
import EditModal from "../EditModal/EditModal";
import { useNavigate } from "react-router-dom";

export default function ListingsTableView({
  listingsData,
  locationFilter,
  priceRangeFilter,
  sortBy,
}) {
  //STATES:
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  //VARIABLES:
  const itemsPerPage = 10;
  let displayData = applyFilters(
    filteredData,
    locationFilter,
    priceRangeFilter,
    sortBy
  );
  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const isAllSelected = selectedRows.length === itemsPerPage;

  //EDITING METHODS:
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (editedItem) => {
    const updatedData = [...filteredData];
    const indexToBeEdited = updatedData.findIndex(
      (item) => item.property_id === editingItem.property_id
    );

    if (indexToBeEdited !== -1) {
      updatedData[indexToBeEdited] = editedItem;
      setFilteredData(updatedData);
    }

    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  //DELETION OPERATIONS:
  const handleDelete = (id) => {
    const updatedData = filteredData.filter((ele) => ele.property_id !== id);
    //// If all elements on the last page are deleted, adjust the currentPage:
    const updatedTotalPages = Math.ceil(updatedData.length / itemsPerPage);
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }

    setFilteredData(updatedData);

    setSelectedRows([]);
  };

  const handleDeleteAllSelected = () => {
    if (!selectedRows.length) return;
    const updatedData = filteredData.filter(
      (property) => !selectedRows.includes(property.property_id)
    );
    //// If all elements on the last page are deleted, adjust the currentPage:
    const updatedTotalPages = Math.ceil(updatedData.length / itemsPerPage);
    if (currentPage > updatedTotalPages) {
      setCurrentPage(updatedTotalPages);
    }

    setFilteredData(updatedData);

    setSelectedRows([]);
  };

  //CHECKBOXES OPERATION METHODS:
  const handleRowCheckboxChange = (event, id) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      //If the items is checked, push it into selectedRows array
      setSelectedRows([...selectedRows, id]);
    } else {
      //If the item is unchecked, then remove it from the selected Rows:
      setSelectedRows(selectedRows.filter((item) => item !== id));
    }
  };

  const handleSelectAll = (event, displayData) => {
    if (event.target.checked) {
      //get the startIndex of the currPage.
      const startIndex = (currentPage - 1) * itemsPerPage;

      let rowsSelected = [];
      for (let i = startIndex; i < startIndex + itemsPerPage; i++) {
        if (i < displayData.length)
          rowsSelected.push(displayData[i].property_id);
        else rowsSelected.push(Math.random());
      }

      setSelectedRows(rowsSelected);
    } else {
      setSelectedRows([]);
    }
  };

  //PAGINATION OPERATIONS:
  const handleFirstPage = () => {
    setCurrentPage(1);
    setSelectedRows([]);
  };
  const handleLastPage = () => {
    setCurrentPage(totalPages);
    setSelectedRows([]);
  };
  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setSelectedRows([]);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
    setSelectedRows([]);
  };
  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSelectedRows([]);
  };

  //STATIC METHODS:

  const getPageNumbers = (totalPages) => {
    const pageNumbers = [];
    for (let currPage = 1; currPage <= totalPages; currPage++)
      pageNumbers.push(currPage);
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers(totalPages);

  function applyFilters(filteredData, location, priceRange, sortBy) {
    let updatedData = [...filteredData];

    if (location.length) {
      updatedData = updatedData.filter((listing) =>
        location.includes(listing.city)
      );
    }

    if (priceRange.length) {
      updatedData = updatedData.filter((listing) => {
        let found = false;
        priceRange.forEach((rangeEntry) => {
          let low = rangeEntry.split("-")[0];
          let high = rangeEntry.split("-")[1];
          if (
            Number(listing.price) >= Number(low) &&
            Number(listing.price) <= Number(high)
          )
            found = true;
        });
        return found;
      });
    }

    if (sortBy === "price") {
      updatedData.sort(
        (firstListing, secondListing) =>
          firstListing.price - secondListing.price
      );
    } else if (sortBy === "date") {
      updatedData.sort(
        (firstListing, secondListing) =>
          new Date(firstListing.listing_date) -
          new Date(secondListing.listing_date)
      );
    }

    return updatedData;
  }

  //USE EFFECTS:
  useEffect(() => {
    setFilteredData(listingsData);
  }, [listingsData]);

  useEffect(() => {
    setSelectedRows([]);
  }, [filteredData]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRows([]);
  }, [locationFilter, priceRangeFilter]);

  return (
    <div className="listings-table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(event) => handleSelectAll(event, displayData)}
              />
            </th>
            <th>Property Name</th>
            <th>Price</th>
            <th>Address</th>
            <th>Listing Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {displayData.slice(startIndex, endIndex).map((items, index) => (
            <tr
              className={`table-row ${
                selectedRows.includes(items.property_id) ? "selected" : ""
              }`}
              key={index}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(items.property_id)}
                  onChange={(event) =>
                    handleRowCheckboxChange(event, items.property_id)
                  }
                />
              </td>
              <td
                className="property_name"
                onClick={() => navigate(`/detail/${items.property_id}`)}
              >
                {items.property_name}
              </td>
              <td>Rs{items.price}</td>
              <td>{items.address}</td>
              <td>{items.listing_date}</td>
              <td className="action-items">
                <MdDelete
                  onClick={() => handleDelete(items.property_id, displayData)}
                />
                <TbEdit onClick={() => handleEdit(items)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <button onClick={handleDeleteAllSelected}>Delete Selected</button>
        <div className="pagination-container">
          <span>
            Page {totalPages < 1 ? 0 : currentPage} of {totalPages}
          </span>
          <div className="pagination">
            <button onClick={handleFirstPage} disabled={currentPage === 1}>
              First
            </button>
            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageClick(number)}
                className={`${number === currentPage ? "active" : ""}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
      {isEditModalOpen && (
        <EditModal
          item={editingItem}
          onSave={handleEditSave}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  );
}
